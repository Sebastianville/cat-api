// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");


//Set Axios defaults
axios.defaults.baseURL = "https://api.thecatapi.com/v1/";
axios.defaults.headers.common["x-api-key"] = "live_Z7NyeMP6mOji4n2Yc8H6WkVuqf1cHCa6V2c7YTfWdtvBTHhLxKqcTLgfIONMyzhU";

const { data: images } = await axios.get(`images/search`, {
    params: { breed_ids: breedId, limit: 5 }
});

breedSelect.addEventListener("change", async (e) => {
    const breedId = e.target.value;

    if (breedId === '') return;

    try {
        // Axios request with default baseURL and headers
        const { data: images } = await axios.get(`images/search`, {
            params: { breed_ids: breedId, limit: 5 }
        });

        console.log(images);

        // Clear previous carousel items
        Carousel.clear();

        images.forEach(image => {
            const carouselItem = Carousel.createCarouselItem(
                image.url,
                image.breeds[0]?.name || "Cat Image",
                image.id
            );
            Carousel.appendCarousel(carouselItem);
        });

        const breedData = images[0]?.breeds[0];

        if (breedData) {
            infoDump.innerHTML = `
                <h2>${breedData.name}</h2>
                <p>${breedData.description}</p>
                <p><strong>Temperament:</strong> ${breedData.temperament}</p>
                <p><strong>Origin:</strong> ${breedData.origin}</p>
            `;
        } else {
            infoDump.innerHTML = `<p>No breed information available.</p>`;
        }

    } catch (e) {
        console.error("Error fetching cat images:", e);
    }
});

//step 5 
axios.interceptors.request.use((config) => {
    console.log("Request started:", config.url);
    config.metadata = { startTime: new Date() };
    document.body.style.cursor = "progress"; 
    progressBar.style.width = "0%"; 
    return config;
});

axios.interceptors.response.use((response) => {
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`Response received in ${duration}ms`);
    document.body.style.cursor = "default"; 
    return response;
});

//Step 6

