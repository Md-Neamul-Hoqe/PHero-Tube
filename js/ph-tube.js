/* Questions */
// Discuss the scope of var, let, and const
// Tell us the use cases of null and undefined
// What do you mean by REST API?

/* To load categories */
const loadingToggle = document.getElementById("loader");
const loadCategories = async () => {
  loadingToggle.classList.remove("hidden");

  const res = await fetch(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const data = await res.json();

  /* show the category buttons */
  showButtons(data.data);

  /* load the videos */
  loadData();
};

/* set categories as buttons */
const showButtons = (data) => {
  const btnContainer = document.getElementById("buttons");

  data.forEach((cat) => {
    const btn = document.createElement("button");
    btn.setAttribute(
      "class",
      "btn bg-gray-600/15 text-gray-600 font-medium active:bg-red-button active:text-white active:font-semibold hover:bg-red-button hover:text-white hover:font-semibold"
    );
    btn.setAttribute("onclick", `loadData('${cat.category_id}')`);
    btn.innerText = cat.category;

    btnContainer.appendChild(btn);
  });
};

/* To load data */
const loadData = async (id = 1000, isSorted = false) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  );
  const data = await res.json();
  const videos = data.data;

  /* sort the videos as views on btn clicked */
  if (isSorted) {
    videos.sort((a, b) => {
      const first = b?.others?.views.slice(0, -1);
      const second = a?.others?.views.slice(0, -1);

      const FE = parseFloat(first);
      const SE = parseFloat(second);

      return FE * 1000 - SE * 1000;
    });
  }

  /* Show the fetched data */
  showData(videos);
};

const showData = (videos) => {
  const videoContainer = document.getElementById("videoContainer");
  videoContainer.innerHTML = "";

  if (videos.length) {
    videoContainer.setAttribute(
      "class",
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    );
    videos.forEach((video) => {
      console.log(video);
      const card = document.createElement("div");
      const cardBody = document.createElement("div");
      const videoDescription = document.createElement("div");
      const verifiedName = document.createElement("p");

      card.setAttribute("class", "card");
      cardBody.setAttribute("class", "card-body px-0 py-5");
      verifiedName.setAttribute("class", "py-1 flex items-center");

      card.innerHTML = `<figure class='rounded-lg relative'><img class='rounded-lg md:min-w-[312px] md:h-[20vw]' src="${video?.thumbnail}" alt="thumbnail image" /></figure>`;

      /* posted date */
      if (video?.others?.posted_date) {
        const [H, M] = secondeToTime(video?.others?.posted_date);
        const postedDateStatus = document.createElement("div");
        postedDateStatus.setAttribute(
          "class",
          "bg-black text-white text-[10px] absolute right-3 bottom-3 py-1 px-[5px] rounded"
        );
        postedDateStatus.innerHTML = `<span>${H}</span>hrs <span>${M} </span>min ago`;
        card.children[0].appendChild(postedDateStatus);
        console.log(H, M);
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
    videoContainer.appendChild(noneToShow);
  }
};

loadCategories();

const sorter = (isSorted) => {
  loadData(undefined, isSorted);
};

const secondeToTime = (second) => {
  const s = parseInt(second);

  console.log(typeof s, s);

  const H = Math.floor(s / 3600);
  const M = Math.floor((s % 3600) / 60);
  return [H, M];
};

// console.log(Math.floor((14200 % 3600) / 60));
// Converted time: 3hrs 56min ago
