/* Links */
// https://openapi.programming-hero.com/api/videos/categories
// https://openapi.programming-hero.com/api/videos/category/${id}
// https://openapi.programming-hero.com/api/videos/category/1000

/* Questions */
// Discuss the scope of var, let, and const
// Tell us the use cases of null and undefined
// What do you mean by REST API?

/* To load categories */
const loadCategories = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const data = await res.json();

  showButtons(data.data);
};
loadCategories();

/* To load data */
const loadData = async (id = 1000) => {
  console.log(`https://openapi.programming-hero.com/api/videos/category/${id}`);
  const res = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  );
  const data = await res.json();

  //   showData(data.data);
  sortByViews(data.data);
};
loadData();

const showButtons = (data) => {
  const btnContainer = document.getElementById("buttons");

  data.forEach((cat) => {
    const btn = document.createElement("button");
    btn.setAttribute(
      "class",
      "btn bg-gray-600/20 font-medium active:bg-red-button active:text-white active:font-semibold hover:bg-red-button hover:text-white hover:font-semibold"
    );
    btn.setAttribute("onclick", `loadData('${cat.category_id}')`);
    btn.innerText = cat.category;

    btnContainer.appendChild(btn);
  });
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

      videoDescription.innerHTML = `<h1 class="leading-[26px] font-bold">${video.title}</h1>
    <p class="py-1"><span class='views'>${video?.others?.views}</span> views</p>`;
      cardBody.innerHTML = `<div class="flex items-start gap-3"></div>`;
      cardBody.children[0].innerHTML = `<div class="avatar">
    <div class="w-10 rounded-full">
        <img src="${video?.authors[0]?.profile_picture}" />
    </div>
</div>`;

      card.innerHTML = `<figure class='rounded-lg'><img class='rounded-lg md:min-w-[312px] md:h-[20vw]' src="${video?.thumbnail}" alt="thumbnail image" /></figure>`;

      if (video?.authors[0]?.verified) {
        verifiedName.innerHTML = `${video?.authors[0]?.profile_name} <img class='inline pl-5' src="./assets/tick.svg" alt="verified">`;
      } else {
        verifiedName.innerText = video?.authors[0]?.profile_name;
      }
      videoDescription.lastElementChild.before(verifiedName);

      cardBody.children[0].appendChild(videoDescription);
      card.appendChild(cardBody);
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

function sortByViews(videos) {
  console.log(videos);
  videos.sort(sortByView);
  console.log(videos);
  videos.forEach((video) => {
    console.log(video?.others?.views);
  });

  function sortByView(a, b) {
    const first = a?.others?.views;
    const second = b?.others?.views;
    const aL = a?.others?.views.length - 2;
    const bL = b?.others?.views.length - 2;
    console.log(aL, first[aL + 1], v = first.slice(aL, 1), v);
    console.log(
      a?.others?.views.slice(aL, 1),
      b?.others?.views.slice(bL, 1),
      a?.others?.views.slice(aL, 1) - b?.others?.views.slice(bL, 1)
    );
    return a?.others?.views - b?.others?.views;
  }
}
