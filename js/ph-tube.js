/* Questions */
// Discuss the scope of var, let, and const
// Tell us the use cases of null and undefined
// What do you mean by REST API?

/* getting the elements by id's */
const loadingToggle = document.getElementById("loader");
const btnContainer = document.getElementById("buttons");
const videoContainer = document.getElementById("videoContainer");

let currentId = 1000;
// isSorted = false;

const loadCategories = async (id = currentId) => {
  loadingToggle.classList.remove("hidden");

  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/videos/categories"
    );
    const data = await res.json();

    /* show the category buttons */
    showButtons(data.data, id);
  } catch (error) {
    console.log("To Loading Categories, Error Found: ", error);
  }
};

/* set categories as buttons */
const showButtons = (data, id) => {
  currentId = id;

  btnContainer.innerHTML = "";

  data.forEach((cat) => {
    const currentBtn = cat.category_id == currentId;
    // console.log(currentBtn, typeof cat.category_id, typeof currentId);

    const btn = document.createElement("a");
    btn.setAttribute("id", cat.category_id);
    btn.setAttribute(
      "class",
      `btn ${
        currentBtn
          ? "bg-red-button text-white font-semibold"
          : "bg-gray-600/15 text-gray-600 font-medium"
      } hover:bg-red-button hover:text-white hover:font-semibold`
    );
    btn.setAttribute(
      "onclick",
      `loadCategories('${cat.category_id}'); loadData('${cat.category_id}', false)`
    );
    btn.innerText = cat.category;
    btnContainer.appendChild(btn);
  });
};

const updateData = (id) => {
  console.log(id);

  Array.from(btnContainer.children).forEach((btn) => {
    // console.log(btn.classList.contains("bg-red-button"));
    // if (btn.classList.contains(`bg-red-button`)) {
    btn.className.replace(" bg-red-button", " bg-gray-600/15");
    btn.className.replace(" text-white", " text-gray-600");
    btn.className.replace(" font-semibold", " font-medium");
    // btn.classList.add("bg-gray-600/15");
    // btn.classList.remove("bg-red-button");
    // btn.classList.add("");
    // btn.classList.remove("");
    // btn.classList.add("");
    // btn.classList.remove("");
    // }

    if (currentId == id) {
      btn.className.replace(" bg-gray-600/15", " bg-red-button");
      btn.className.replace(" text-gray-600", " text-white");
      btn.className.replace(" font-medium", " font-semibold");
    }
  });
  console.log(btnContainer.children);
};

/* To load data */
const loadData = async (id = 1000, isSorting = false) => {
  try {
    /* Clean the video container */
    videoContainer.innerHTML = "";

    /* fetch the videos */
    const res = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${id}`
    );
    const data = await res.json();
    const videos = data.data;

    /* sort the videos as views on btn clicked */
    if (isSorting) {
      videos.sort((a, b) => {
        const first = b?.others?.views.slice(0, -1);
        const second = a?.others?.views.slice(0, -1);

        const FE = parseFloat(first);
        const SE = parseFloat(second);

        return FE * 1000 - SE * 1000;
      });
    }

    currentId = id;

    /* Show the fetched data */
    showData(videos);
  } catch (error) {
    console.log("To Loading Data, Error Found: ", error);
  }
};

const showData = (videos) => {
  if (videos.length) {
    videoContainer.setAttribute(
      "class",
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    );

    videos.forEach((video) => {
      // console.log(video);
      const card = document.createElement("div");
      const cardBody = document.createElement("div");
      const videoDescription = document.createElement("div");
      const verifiedName = document.createElement("p");

      card.setAttribute("class", "card");
      cardBody.setAttribute("class", "card-body px-0 py-5");
      verifiedName.setAttribute("class", "py-1 flex items-center");

      card.innerHTML = `<figure class='rounded-lg relative'><img class='rounded-lg min-w-[80%] sm:max-h-[20vw] md:h-[14vw]' src="${video?.thumbnail}" alt="thumbnail image" /></figure>`;

      /* posted date */
      const PD = video?.others?.posted_date;
      if (PD) {
        const [H, M] = secondeToTime(PD);

        const postedDateStatus = document.createElement("div");
        postedDateStatus.setAttribute(
          "class",
          "bg-black text-white text-[10px] absolute right-3 bottom-3 py-1 px-[5px] rounded"
        );
        postedDateStatus.innerHTML = `<span>${H}</span>hrs <span>${M} </span>min ago`;
        card.children[0].appendChild(postedDateStatus);
        // console.log(H, M);
      }

      videoDescription.innerHTML = `<h1 class="leading-[26px] text-header font-bold">${video.title}</h1>
    <p class="py-1"><span class='views'>${video?.others?.views}</span> views</p>`;

      cardBody.innerHTML = `<div class="flex items-start gap-3"></div>`;

      cardBody.children[0].innerHTML = `
        <div class="avatar"><div class="w-10 rounded-full">
            <img src="${video?.authors[0]?.profile_picture}" />
        </div>`;

      /* Verification status */
      if (video?.authors[0]?.verified) {
        verifiedName.innerHTML = `${video?.authors[0]?.profile_name} <img class='inline pl-5' src="./assets/tick.svg" alt="verified">`;
      } else {
        verifiedName.innerText = video?.authors[0]?.profile_name;
      }
      videoDescription.lastElementChild.before(verifiedName);

      cardBody.children[0].appendChild(videoDescription);
      card.appendChild(cardBody);

      /* toggle loading */
      loadingToggle.classList.add("hidden");
      videoContainer.appendChild(card);
    });
  } else {
    videoContainer.setAttribute(
      "class",
      "grid grid-cols-1 justify-center items-center text-center min-h-[calc(100vh-268px)]"
    );
    const noneToShow = document.createElement("div");
    noneToShow.innerHTML = `
    <div>
        <img class="mx-auto mb-8" src="./assets/Icon.png" alt="none to show">
        <p class="text-[32px] font-bold leading-normal">Oops!! Sorry, There is no <br> content here</p>
    </div>`;

    /* toggle loading */
    loadingToggle.classList.add("hidden");
    videoContainer.appendChild(noneToShow);
  }
};

const sorter = (isSorting) => {
  // isSorted = isSorting;
  loadData(currentId, isSorting);
};

const secondeToTime = (second) => {
  const s = parseInt(second);

  const H = Math.floor(s / 3600);
  const M = Math.floor((s % 3600) / 60);
  return [H, M];
};

/* load the categories */
loadCategories();

/* load the videos */
loadData();
