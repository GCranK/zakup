document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const categoriesContainer = document.getElementById("categories");
    const productList = document.getElementById("productList");
    const sendButton = document.getElementById("sendData");
    const productsSection = document.getElementById("products");
    const loader = document.getElementById("loader");
    loader.style.display = "none";
    let selectedItems = {};
    let currentWarehouse = localStorage.getItem("selectedWarehouse") || "BAR";

    const products = {
        bar: {
            "Фрукты/овощи": ["Лимон", "Яблоки", "Апельсины", "Морковь"],
            "Зелень": ["Мята"],
            "Бакалея": ["Сахар", "Чай чёрный", "Чай зелёный"],
            "Напитки": ["Адреналин 0.5", "Кола 0.5", "Ред Булл 0.25"],
            "Канцелярия": ["Бумага А4", "Термобумага для чеков большая"],
            "Снеки": ["Шоколад Alpen Gold", "Чокопай", "Орео", "Барни"]
        },
        kitchen: {
            "Мясо": ["Говядина", "Куриные бёдра", "Куриное филе", "Куриные голени"],
            "Овощи": ["Красная морковь", "Жёлтая морковь", "Лук", "Картошка"],
            "Зелень": ["Латук", "Лолло росса", "Петрушка", "Укроп", "Кинза", "Салат Айсберг", "Мята"],
            "Крупы": ["Рис лазер", "Красная фасоль", "Феттучини"],
            "Хлеб": ["Лепёшки"],
            "Бакалея": ["Салат чимчи", "Зира", "Наватт на палочке"]
        },
        household: {
            "Хоз. товары": [
                "Гель для посуды", "Перчатки жёлтые большие", "Пакеты для мусора большие",
                "Пакеты для мусора маленькие (50×65)", "Губки для посуды большие",
                "Губки для посуды блестящие", "Жидкое мыло (5 л)", "Азелит",
                "Тряпки цветные", "Отбеливатель", "Диспенсерки (салфетки)",
                "Туалетная бумага простая"
            ]
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            currentWarehouse = this.dataset.warehouse.toUpperCase();
            localStorage.setItem("selectedWarehouse", currentWarehouse);
            updateCategories(this.dataset.warehouse);
        });
    });

    function updateCategories(warehouse) {
        categoriesContainer.innerHTML = "";
        Object.keys(products[warehouse]).forEach(category => {
            const div = document.createElement("div");
            div.classList.add("category");
            div.dataset.category = category;
            div.innerHTML = `<i class="fas fa-box"></i><p>${category}</p>`;
            div.addEventListener("click", () => loadProducts(warehouse, category));
            categoriesContainer.appendChild(div);
        });
    }

    function loadProducts(warehouse, category) {
        productList.innerHTML = "";
        productsSection.classList.remove("hidden");

        products[warehouse][category].forEach(product => {
            const defaultUnit = category === "Фрукты/овощи" ? "кг" : "шт";
            const savedData = selectedItems[product] || { quantity: "", unit: defaultUnit };

            const li = document.createElement("li");
            li.innerHTML = `
                <div class="item-container">
                    <span class="product-name">${product}</span>
                    <input type="number" min="0" class="product-input" value="${savedData.quantity}" onfocus="this.value=''">
                    <select class="product-unit">
                        <option ${savedData.unit === "шт" ? "selected" : ""}>шт</option>
                        <option ${savedData.unit === "кг" ? "selected" : ""}>кг</option>
                        <option ${savedData.unit === "гр" ? "selected" : ""}>гр</option>
                        <option ${savedData.unit === "л" ? "selected" : ""}>л</option>
                    </select>
                </div>
            `;

            const input = li.querySelector(".product-input");
            const select = li.querySelector(".product-unit");

            input.addEventListener("input", () => saveSelection(product, category, input.value, select.value));
            select.addEventListener("change", () => saveSelection(product, category, input.value, select.value));

            productList.appendChild(li);
        });
    }

    function saveSelection(product, category, quantity, unit) {
        if (quantity > 0) {
            selectedItems[product] = { category, quantity, unit };
        } else {
            delete selectedItems[product];
        }
    }

    sendButton.addEventListener("click", () => {
        const items = Object.keys(selectedItems).map(name => ({
            name,
            category: selectedItems[name].category,
            quantity: selectedItems[name].quantity,
            unit: selectedItems[name].unit
        }));

        if (items.length === 0) {
            alert("⚠️ Вы не выбрали товары!");
            return;
        }

        console.log("📦 Итоговый заказ:", { warehouse: currentWarehouse, items });
        loader.style.display = "flex";


        setTimeout(() => {
            fetch("https://frontend-developer.uz/sendzakup.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ warehouse: currentWarehouse, items })
            })
            .then(response => response.text())
            .then(data => {
                console.log("Ответ сервера:", data);
                alert("✅ Заказ отправлен!");
                setTimeout(() => {
                    loader.style.display = "none";
                    location.reload();
                }, 500);
            })
            .catch(error => {
                alert("❌ Ошибка отправки заказа!");
                console.error("Ошибка:", error);
                loader.style.display = "none";
            });
        }, 1000);
    });

    document.querySelector(`.tab[data-warehouse="${currentWarehouse.toLowerCase()}"]`).classList.add("active");
    updateCategories(currentWarehouse.toLowerCase());
});
