import { useState } from "react";
import { useCart } from "../context/CartContext";

function CustomPizza() {

    const { addToCart } = useCart();

    const [pizza, setPizza] = useState({
        base: null,
        sauce: null,
        cheese: null,
        vegetables: []
    });

    const [message, setMessage] = useState("");

    const bases = [
        "Thin Crust",
        "Classic Crust",
        "Cheese Burst",
        "Whole Wheat",
        "Italian Herb"
    ];

    const sauces = [
        "Tomato Sauce",
        "Spicy Sauce",
        "BBQ Sauce",
        "Pesto Sauce",
        "Creamy Garlic"
    ];

    const cheeses = [
        "Mozzarella",
        "Cheddar",
        "Parmesan",
        "Cheese Blend"
    ];

    const vegetables = [
        "Onion",
        "Capsicum",
        "Tomato",
        "Corn",
        "Mushroom",
        "Olives",
        "Jalapeno"
    ];

    // SELECT / UNSELECT BASE
    const selectBase = (base) => {
        setPizza({
            ...pizza,
            base: pizza.base === base ? null : base
        });

        setMessage("");
    };

    // SELECT / UNSELECT SAUCE
    const selectSauce = (sauce) => {
        setPizza({
            ...pizza,
            sauce: pizza.sauce === sauce ? null : sauce
        });

        setMessage("");
    };

    // SELECT / UNSELECT CHEESE
    const selectCheese = (cheese) => {
        setPizza({
            ...pizza,
            cheese: pizza.cheese === cheese ? null : cheese
        });

        setMessage("");
    };

    // SELECT / REMOVE VEGETABLE
    const toggleVegetable = (vegetable) => {
        if (pizza.vegetables.includes(vegetable)) {
            setPizza({
                ...pizza,
                vegetables: pizza.vegetables.filter(
                    (item) => item !== vegetable
                )
            });
        } else {
            setPizza({
                ...pizza,
                vegetables: [
                    ...pizza.vegetables,
                    vegetable
                ]
            });
        }

        setMessage("");
    };

    // VALIDATION
    const handleContinue = () => {
        if (!pizza.base) {
            setMessage("Please select a base.");
            return;
        }

        if (!pizza.sauce) {
            setMessage("Please select a sauce.");
            return;
        }

        if (!pizza.cheese) {
            setMessage("Please select cheese.");
            return;
        }

        const customPizza = {
            id: `custom-${Date.now()}`,
            name: "Custom Pizza",
            base: pizza.base,
            sauce: pizza.sauce,
            cheese: pizza.cheese,
            vegetables: pizza.vegetables,
            price: 299
        };

        addToCart(customPizza);

        setMessage("Pizza added to cart successfully!");
    };

    return (
        <div>
            <h1>Custom Pizza Builder</h1>

            {/* STEP 1 - BASE */}
            <section>
                <h2>Step 1: Choose Base</h2>

                {bases.map((base) => (
                    <button
                        key={base}
                        onClick={() => selectBase(base)}
                        style={{
                            margin: "5px",
                            padding: "10px",
                            backgroundColor:
                                pizza.base === base
                                    ? "green"
                                    : "white",
                            color:
                                pizza.base === base
                                    ? "white"
                                    : "black",
                            cursor: "pointer"
                        }}
                    >
                        {base}
                    </button>
                ))}
            </section>

            <br />

            {/* STEP 2 - SAUCE */}
            <section>
                <h2>Step 2: Choose Sauce</h2>

                {sauces.map((sauce) => (
                    <button
                        key={sauce}
                        onClick={() => selectSauce(sauce)}
                        style={{
                            margin: "5px",
                            padding: "10px",
                            backgroundColor:
                                pizza.sauce === sauce
                                    ? "green"
                                    : "white",
                            color:
                                pizza.sauce === sauce
                                    ? "white"
                                    : "black",
                            cursor: "pointer"
                        }}
                    >
                        {sauce}
                    </button>
                ))}
            </section>

            <br />

            {/* STEP 3 - CHEESE */}
            <section>
                <h2>Step 3: Choose Cheese</h2>

                {cheeses.map((cheese) => (
                    <button
                        key={cheese}
                        onClick={() => selectCheese(cheese)}
                        style={{
                            margin: "5px",
                            padding: "10px",
                            backgroundColor:
                                pizza.cheese === cheese
                                    ? "green"
                                    : "white",
                            color:
                                pizza.cheese === cheese
                                    ? "white"
                                    : "black",
                            cursor: "pointer"
                        }}
                    >
                        {cheese}
                    </button>
                ))}
            </section>

            <br />

            {/* STEP 4 - VEGETABLES */}
            <section>
                <h2>Step 4: Choose Vegetables</h2>

                {vegetables.map((vegetable) => (
                    <label
                        key={vegetable}
                        style={{
                            display: "block",
                            margin: "8px"
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={pizza.vegetables.includes(
                                vegetable
                            )}
                            onChange={() =>
                                toggleVegetable(vegetable)
                            }
                        />

                        {" "}

                        {vegetable}
                    </label>
                ))}
            </section>

            <br />

            {/* STEP 5 - SUMMARY */}
            <section>
                <h2>Pizza Summary</h2>

                <p>
                    <strong>Base:</strong>{" "}
                    {pizza.base || "Not selected"}
                </p>

                <p>
                    <strong>Sauce:</strong>{" "}
                    {pizza.sauce || "Not selected"}
                </p>

                <p>
                    <strong>Cheese:</strong>{" "}
                    {pizza.cheese || "Not selected"}
                </p>

                <p>
                    <strong>Vegetables:</strong>{" "}
                    {pizza.vegetables.length > 0
                        ? pizza.vegetables.join(", ")
                        : "None selected"}
                </p>

                <br />

                {/* CONTINUE TO CART */}
                <button
                    onClick={handleContinue}
                    style={{
                        padding: "12px 20px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Add to Cart
                </button>

                {/* MESSAGE */}
                {message && (
                    <p
                        style={{
                            marginTop: "15px",
                            fontSize: "18px",
                            fontWeight: "bold"
                        }}
                    >
                        {message}
                    </p>
                )}
            </section>
        </div>
    );
}

export default CustomPizza;

