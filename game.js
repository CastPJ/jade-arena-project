const infoBar = document.getElementById("info-bar");
const skillBtns = document.querySelectorAll(".skill");
const avatarBtns = document.querySelectorAll(".avatar");

let champion1 = "kenshin";
let champion2 = "hathun";
let champion3 = "silvia";

skillBtns.forEach((skillBtn) => {
  skillBtn.addEventListener("click", showSkillInfo);
});
avatarBtns.forEach((avatarBtn) => {
  avatarBtn.addEventListener("click", showChampionInfo);
});
document.addEventListener("DOMContentLoaded", loadSkills);

function loadSkills(e) {
  e.preventDefault();
  fetch("/data/champions.json")
    .then((response) => response.json())
    .then((data) => {
      const champions = [champion1, champion2, champion3];

      const costs = champions.flatMap((champion) =>
        Object.values(data.champions[champion].skills).map(
          (skill) => skill?.cost
        )
      );

      let skillIndex = 1;

      costs.forEach((cost) => {
        const energyDiceContainer = document.getElementById(
          `skill${skillIndex}`
        );

        if (energyDiceContainer) {
          const energyDiceArray = cost.split("-");

          const energyTypes = [
            "fire",
            "water",
            "earth",
            "wind",
            "light",
            "dark",
          ];

          energyDiceArray.forEach((dice, index) => {
            const numberOfDice = Number(dice);
            if (numberOfDice > 0) {
              for (let i = 0; i < numberOfDice; i++) {
                const energyDice = document.createElement("div");
                energyDice.classList.add("energy-dice");
                energyDice.classList.add(energyTypes[index]);
                energyDiceContainer.appendChild(energyDice);
              }
            }
          });
        }

        skillIndex += 1;
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function showChampionInfo(e, championName = null) {
  e?.preventDefault();

  if (!championName) {
    const url = e.target.src;
    const parts = url.split("/");
    championName = parts[parts.length - 1].split(".")[0].split("-")[0];
  }

  fetch("/data/champions.json")
    .then((response) => response.json())
    .then((data) => {
      const champion = data.champions[championName.toLowerCase()];
      const championSkills = Object.values(champion.skills);

      infoBar.innerHTML = `
        <div class="row info-image-row">
          <div class="col image-col">
            <img
              class="img-avatar info-img-avatar"
              src="/images/Champions/${championName}/${championName}-avatar.jpeg"
              alt=""
            />
          </div>
          ${championSkills
            .map(
              (skill, index) => `
          <div class="col image-col">
            <img
              class="img-skill skill"
              src="/images/Champions/${championName}/${championName}-skill${
                index + 1
              }.jpeg"
              alt=""
            />
          </div>
          `
            )
            .join("")}
        </div>
        <div class="row info-name-row">
          <div class="col info-name-col">${champion.name}</div>
          ${championSkills
            .map(
              (skill) => `
          <div class="col info-skill-name-col">
            <h6 class="m-0">${skill.name}</h6>
            ${skill.shortDsc}
          </div>
          `
            )
            .join("")}
        </div>`;

      const newSkillBtns = document.querySelectorAll(".skill");
      newSkillBtns.forEach((skillBtn) => {
        skillBtn.addEventListener("click", showSkillInfo);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

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
      const skill = champion.skills[focusedSkill];
      const skillImg = skill.img;
      const skillName = skill.name;
      const skillShortDsc = skill.shortDsc;
      const skillLongDsc = skill.longDsc;
      const skillCd = skill.cd;

      const energyDiceArray = skill.cost.split("-");
      const energyTypes = ["fire", "water", "earth", "wind", "light", "dark"];
      let skillCost = "";

      energyDiceArray.forEach((dice, index) => {
        const numberOfDice = Number(dice);
        if (numberOfDice > 0) {
          for (let i = 0; i < numberOfDice; i++) {
            skillCost += `<div class="energy-dice ${energyTypes[index]}"></div>`;
          }
        }
      });

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
              <button class="row btn btn-default back-to-champion-btn">
                Back to champion
              </button>
            </div>
          </div>`;

      const backToChampionBtn = document.querySelector(".back-to-champion-btn");
      backToChampionBtn.addEventListener("click", () =>
        showChampionInfo(null, focusedChampion)
      );
    })
    .catch((error) => console.error("Error fetching data:", error));
}
