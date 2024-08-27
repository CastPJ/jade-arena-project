const infoBar = document.getElementById("info-bar");
const skillBtns = document.querySelectorAll(".skill");
const avatarBtns = document.querySelectorAll(".avatar");
skillBtns.forEach((skillBtn) => {
  skillBtn.addEventListener("click", showSkillInfo);
});
avatarBtns.forEach((avatarBtn) => {
  avatarBtn.addEventListener("click", showChampionInfo);
});

function showSkillInfo(e) {
  e.preventDefault();
  const url = e.target.src;
  const parts = url.split("/");
  const part = parts[parts.length - 1].split(".")[0];
  const focusedChampion = part.split("-")[0].toLowerCase();
  const focusedSkill = part.split("-")[1];

  fetch("/data/champions.json")
    .then((response) => response.json())
    .then((data) => {
      const champion = data.champions[focusedChampion];
      let skill = focusedSkill;
      // let championName
      const skillImg = champion.skills[skill].img;
      let skillName = champion.skills[skill].name;
      let skillShortDsc = champion.skills[skill].shortDsc;
      let skillLongDsc = champion.skills[skill].longDsc;
      let skillCost = champion.skills[skill].cost.fire;
      let skillCd = champion.skills[skill].cd;
      infoBar.innerHTML = `
         <div class="row">
            <div class="col-3">
              <div class="row info-img">
                <img
                  class="p-0"
                  src="/images/Champions/${skillImg}"
                  alt=""
                />
              </div>
              <div class="row info-add">
                <div class="col info-energy">${skillCost}</div>
                <div class="col info-cooldown">Cd: ${skillCd}</div>
              </div>
            </div>
            <div class="col-9 skill-description">
              <div class="row skill-name">${skillName}</div>
              <div class="row skill-short-description">
                ${skillShortDsc}
              </div>
              <div class="row skill-long-description">
                ${skillLongDsc}
              </div>
            </div>
          </div>`;
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function showChampionInfo(e) {
  e.preventDefault();
  const url = e.target.src;
  const parts = url.split("/");
  const part = parts[parts.length - 1].split(".")[0];
  const focusedChampion = part.split("-")[0];
  infoBar.innerHTML = `<div class="row info-image-row">
            <div class="col image-col">
              <img
                class="img-avatar info-img-avatar"
                src="/images/Champions/${focusedChampion}/${focusedChampion}-avatar.jpeg"
                alt=""
              />
            </div>
            <div class="col image-col">
              <img
                class="img-skill skill"
                src="/images/Champions/${focusedChampion}/${focusedChampion}-skill1.jpeg"
                alt=""
              />
            </div>
            <div class="col image-col">
              <img
                class="img-skill skill"
                src="/images/Champions/${focusedChampion}/${focusedChampion}-skill2.jpeg"
                alt=""
              />
            </div>
            <div class="col image-col">
              <img
                class="img-skill skill"
                src="/images/Champions/${focusedChampion}/${focusedChampion}-skill3.jpeg"
                alt=""
              />
            </div>
            <div class="col image-col">
              <img
                class="img-skill skill"
                src="/images/Champions/${focusedChampion}/${focusedChampion}-skill4.jpeg"
                alt=""
              />
            </div>
          </div>
          <div class="row info-name-row">
            <div class="col info-name-col">${focusedChampion}</div>
            <div class="col info-skill-name-col">
              <h6 class="m-0">Thrust</h6>
              DMG | 25 | single target
            </div>
            <div class="col info-skill-name-col">
              <h6 class="m-0">Thrust</h6>
              DMG | 25 | single target
            </div>
            <div class="col info-skill-name-col">
              <h6 class="m-0">Thrust</h6>
              DMG | 25 | single target
            </div>
            <div class="col info-skill-name-col">
              <h6 class="m-0">Thrust</h6>
              DMG | 25 | single target
            </div>
          </div>`;
  const newSkillBtns = document.querySelectorAll(".skill");
  newSkillBtns.forEach((skillBtn) => {
    skillBtn.addEventListener("click", showSkillInfo);
  });
}
