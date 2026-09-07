import User from "../models/User.js";

// ==========================================
// ADMIN - GET ALL USERS
// ==========================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      message: "All users fetched successfully",
      users
    });

  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// ADMIN - UPDATE USER ROLE
// ==========================================

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Role must be user or admin."
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Prevent admin from changing their own role
    if (req.user.userId === user._id.toString()) {
      return res.status(400).json({
        message: "You cannot change your own role."
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      message: `User role updated to ${role} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// ADMIN - ACTIVATE / DEACTIVATE USER
// ==========================================

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Validate isActive
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false."
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user.userId === user._id.toString()) {
      return res.status(400).json({
        message: "You cannot deactivate your own account."
      });
    }

    user.isActive = isActive;

    await user.save();

    res.status(200).json({
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// ADMIN - DELETE USER
// ==========================================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.userId === user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account."
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

