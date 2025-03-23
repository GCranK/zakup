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
            "Фрукты/овощи": ["Лимон", "Яблоки", "Апельсины", "Морковь", "Огурцы", "Мандарины", "Имбирь корень"],
            "Зелень": ["Мята", "Розмарин ветки"],
            "Бакалея": [
                "Сахар", "Чай чёрный", "Чай зелёный", "Черный чай", "Мед", "Мускатный орех",
                "Черный молотый перец", "Сахар пакетики", "Сахарные стики", "Лёд", "Стикеры для доски"
            ],
            "Напитки": [
                "Адреналин 0.5", "Кола 0.5", "Фанта 0.5", "Спрайт 0.5", "18+ 0.5", "Вода без газа 0.5", "Вода c газом 0.5",
                "Ред Булл 0.25", "Спрайт 1.5л", "Сок в ассортименте", "Вода 10л"
            ],
            "Канцелярия": ["Бумага А4", "Термобумага для чеков большая", "Стикеры"],
            "Снеки": ["Шоколад Alpen Gold (разные)", "Чокопай", "Орео", "Барни", "Какао"],
            "Специи": ["Кардамон", "Бадьян (звёздочка)", "Палочки корицы", "Гвоздика", "Шалфей", "Зверобой", "Трава Душица"]
        },
        kitchen: {
            "Мясо": [
                "Говядина", "Куриные бёдра", "Куриное филе", "Куриная голень", 
                "Куриные крылышки", "Говяжий фарш", "Индейка", "Копчёная говядина", 
                "Сосиски", "Салями",
            ],
            "Фрукты/овощи": [
                "Морковь", "Лук", "Лук шалот", "Картошка", "Помидоры", "Чеснок", "Баклажаны",
                "Дайкон", "Свекла", "Огурцы", "Капуста", "Болгарский перец", 
                "Шампиньоны", "Болгарский светофор", "Лимоны", "Апельсины", "Яблоки"
            ],
            "Зелень": [
                "Латук", "Лолло росса", "Петрушка", "Укроп", "Кинза", "Салат Айсберг", 
                "Мята", "Руккола", "Розмарин", "Зелёный лук", 
                "Микро зелень"
            ],
            "Специи": [
                "Зира", "Орегано", "Чёрный молотый перец", "Кориандр", "Тмин", 
                "Розмарин сухой", "Горчица", "Сухая кинза", "Лавровый лист"
            ],
            "Соуса": [
                "Чили соус", "Барбекю соус", "Соус сырный", "Бальзамический уксус",
                "Соус ореховый", "Унаги соус", "Кимчи соус",  "Тобаско"
            ],
            "Крупы": [
                "Рис лазер", "Красная фасоль", "Гречка", "Маш", "Чечевица", 
                "Феттучини", "Фарфале", "Спагетти", "Макароны"
            ],
            "Хлеб": [
                "Лепёшки", "Лаваш", "Багет", "Чиабатта", "Булочка для бургера", "Тостерный хлеб"
            ],
            "Бакалея": [
                "Яйца", "Сахар", "Сахарные кубики", "Соль", "Томатная паста", "Кетчуп", 
                "Майонез", "Сливочное масло", "Щедрое лето", "Оливковое масло", "Фритюрное масло", 
                "Кунжутное масло", "Жир", "Перепелиные яйца", "Куриные яйца",
                "Томатный сок", "Соя", "Фасоль консервированная", "Кукуруза консервированная",
                "Красная икра",
            ],
            "Молочные продукты": [
                "Молоко", "Сливки", "Фетакса", "Творог", "Голландский сыр", "Гауда сыр", 
                "Пармезан", "Виола сыр", "Творожный сыр", "Чиз сыр (пластинки)", "Сыр моцарелла"
            ],
            "Прочее": [
                "Навват", "Халва", "Курага", "Финики", "Банан сухофрукт", "Сухофрукты",
                "Орехи", "Арахис", "Киш-миш", "Миндаль", "Крабовые палочки", "Креветки",
                "Анчоусы"
            ]
        },
        household: {
            "Хоз. товары": [
                "Гель для посуды", "Перчатки жёлтые большие", "Пакеты для мусора большие",
                "Пакеты для мусора маленькие (50×65)", "Губки для посуды большие",
                "Губки для посуды блестящие", "Жидкое мыло", "Азелит",
                "Тряпки цветные", "Отбеливатель", "Диспенсерки (салфетки)",
                "Туалетная бумага простая", "Тряпка дельфин"
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
            let defaultUnit = "шт";
            if (["Мясо", "Фрукты/овощи"].includes(category)) {
                defaultUnit = "кг";
            } else if (["Зелень", "Специи", "Крупы"].includes(category)) {
                defaultUnit = "гр";
            }
    
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
                        <option ${savedData.unit === "пач/уп" ? "selected" : ""}>пач/уп</option>
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
