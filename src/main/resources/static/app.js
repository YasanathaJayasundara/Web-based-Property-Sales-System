"use strict";

const SEARCH_API = "/api/properties/search";

const searchForm =
    document.querySelector("#search-form");

const propertyGrid =
    document.querySelector("#property-grid");

const resultSummary =
    document.querySelector("#result-summary");

const message =
    document.querySelector("#message");

const loading =
    document.querySelector("#loading");

const refreshButton =
    document.querySelector("#refresh-button");


searchForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();
        loadProperties();
    }
);


searchForm.addEventListener(
    "reset",
    () => {
        setTimeout(loadProperties, 0);
    }
);


refreshButton.addEventListener(
    "click",
    loadProperties
);


async function loadProperties() {
    setLoading(true);
    hideMessage();

    try {
        const response = await fetch(
            buildSearchUrl(),
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                await readError(response)
            );
        }

        const properties =
            await response.json();

        renderProperties(
            Array.isArray(properties)
                ? properties
                : []
        );

    } catch (error) {
        propertyGrid.replaceChildren();

        resultSummary.textContent =
            "COULD NOT LOAD PROPERTIES";

        showMessage(
            error.message ||
            "Please check that the Spring Boot server is running.",
            true
        );

    } finally {
        setLoading(false);
    }
}


function buildSearchUrl() {
    const parameters =
        new URLSearchParams();

    const formData =
        new FormData(searchForm);

    /*
     * Visitors must only see properties
     * published by an administrator.
     */
    parameters.set(
        "status",
        "PUBLISHED"
    );

    for (const [name, rawValue]
        of formData.entries()) {

        const value =
            String(rawValue).trim();

        if (value !== "") {
            parameters.set(name, value);
        }
    }

    return `${SEARCH_API}?${parameters.toString()}`;
}


function renderProperties(properties) {
    const total = properties.length;

    resultSummary.textContent =
        total === 1
            ? "1 PUBLISHED PROPERTY FOUND"
            : `${total} PUBLISHED PROPERTIES FOUND`;

    if (total === 0) {
        propertyGrid.replaceChildren();

        showMessage(
            "No properties match the selected filters.",
            false
        );

        return;
    }

    hideMessage();

    propertyGrid.innerHTML = properties
        .map(createPropertyCard)
        .join("");

    propertyGrid
        .querySelectorAll(".property-image")
        .forEach((image) => {

            image.addEventListener(
                "error",
                () => {
                    const imageBox =
                        image.closest(".image-box");

                    image.remove();

                    imageBox.prepend(
                        createNoImageText()
                    );
                }
            );
        });
}


function createPropertyCard(property) {
    const imageUrl =
        getPrimaryImageUrl(property);

    const imageContent = imageUrl
        ? `
            <img
                class="property-image"
                src="${escapeHtml(imageUrl)}"
                alt="${escapeHtml(
            property.title || "Property"
        )} image"
                loading="lazy"
            >
        `
        : "<span>No property image</span>";

    return `
        <article class="property-card">

            <div class="image-box">

                ${imageContent}

                <span class="type-badge">
                    ${escapeHtml(
        formatType(
            property.propertyType
        )
    )}
                </span>

            </div>

            <div class="card-content">

                <p class="price">
                    ${escapeHtml(
        formatPrice(property.price)
    )}
                </p>

                <h3>
                    ${escapeHtml(
        property.title ||
        "Untitled property"
    )}
                </h3>

                <p class="location">
                    ${escapeHtml(
        formatLocation(property)
    )}
                </p>

                <p class="description">
                    ${escapeHtml(
        property.description ||
        "No description available."
    )}
                </p>

                <div class="facts">

                    <span>
                        ${escapeHtml(
        displayValue(
            property.bedrooms
        )
    )} bedrooms
                    </span>

                    <span>
                        ${escapeHtml(
        displayValue(
            property.bathrooms
        )
    )} bathrooms
                    </span>

                    <span>
                        ${escapeHtml(
        formatArea(property.area)
    )}
                    </span>

                </div>

            </div>

        </article>
    `;
}


function getPrimaryImageUrl(property) {
    const images =
        Array.isArray(property.images)
            ? property.images
            : [];

    const primaryImage =
        images.find(
            (image) =>
                image.primaryImage === true
        );

    return primaryImage?.imageUrl
        || property.imageUrl
        || images[0]?.imageUrl
        || "";
}


function formatPrice(value) {
    const price = Number(value);

    if (!Number.isFinite(price)) {
        return "Price unavailable";
    }

    return new Intl.NumberFormat(
        "en-LK",
        {
            style: "currency",
            currency: "LKR",
            maximumFractionDigits: 0
        }
    ).format(price);
}


function formatLocation(property) {
    const parts = [
        property.location,
        property.city
    ].filter(
        (value) =>
            value &&
            String(value).trim()
    );

    return parts.length > 0
        ? parts.join(", ")
        : "Location unavailable";
}


function formatType(value) {
    if (!value) {
        return "PROPERTY";
    }

    return String(value)
        .replaceAll("_", " ")
        .toUpperCase();
}


function formatArea(value) {
    const area = Number(value);

    return Number.isFinite(area)
        ? `${area.toLocaleString("en-LK")} sq ft`
        : "Area N/A";
}


function displayValue(value) {
    return value === null ||
    value === undefined
        ? "N/A"
        : String(value);
}


function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#039;");
}


function createNoImageText() {
    const text =
        document.createElement("span");

    text.textContent =
        "Image unavailable";

    return text;
}


async function readError(response) {
    try {
        const errorBody =
            await response.json();

        return errorBody.message ||
            `Request failed (${response.status})`;

    } catch (error) {
        return `Request failed (${response.status})`;
    }
}


function showMessage(text, isError) {
    message.textContent = text;

    message.className =
        isError
            ? "message error"
            : "message";

    message.hidden = false;
}


function hideMessage() {
    message.hidden = true;
    message.textContent = "";
}


function setLoading(isLoading) {
    loading.hidden = !isLoading;
    refreshButton.disabled = isLoading;

    searchForm
        .querySelectorAll(
            "input, select, button"
        )
        .forEach((control) => {
            control.disabled = isLoading;
        });
}


loadProperties();