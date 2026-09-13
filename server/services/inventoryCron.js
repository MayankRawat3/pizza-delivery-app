import cron from "node-cron";
import Inventory from "../models/Inventory.js";
import { sendLowStockAlertEmail } from "./emailService.js";

// ==========================================
// LOW STOCK CRON JOB
// ==========================================

const startInventoryCron = () => {
  // Runs every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("Checking inventory for low stock...");

      const lowStockItems = await Inventory.find({
        $expr: {
          $lte: ["$quantity", "$threshold"]
        }
      }).sort({
        category: 1,
        name: 1
      });

      if (lowStockItems.length === 0) {
        console.log("No low-stock items found.");
        return;
      }

      console.log(
        `Low-stock items found: ${lowStockItems.length}`
      );

      // Only send alert for items
      // that have not been alerted yet
      const itemsToAlert = lowStockItems.filter(
        (item) => !item.lowStockAlertSent
      );

      if (itemsToAlert.length === 0) {
        console.log(
          "Low-stock alert already sent. No new email required."
        );
        return;
      }

      // Send email
      await sendLowStockAlertEmail(
        process.env.EMAIL_USER,
        itemsToAlert
      );

      // Mark these items as alerted
      await Inventory.updateMany(
        {
          _id: {
            $in: itemsToAlert.map(
              (item) => item._id
            )
          }
        },
        {
          $set: {
            lowStockAlertSent: true
          }
        }
      );

      console.log(
        "Low-stock alert email sent successfully."
      );

    } catch (error) {
      console.error(
        "INVENTORY CRON ERROR:",
        error
      );
    }
  });

  console.log(
    "Inventory cron job started. Checking every 5 minutes."
  );
};

export default startInventoryCron;