// Global Variables
const infoBar = document.getElementById("info-bar");
const skillBtns = document.querySelectorAll(".skill");
const avatarBtns = document.querySelectorAll(".avatar");
let selectedSkill = null;

// Loaded champions

const champions = ["kenshin", "hathun", "silvia"];

// Buttons Event Listeners

skillBtns.forEach((skillBtn) => {
  skillBtn.addEventListener("click", showSkillInfo);
  // skillBtn.addEventListener("click", focusSkill);
});
avatarBtns.forEach((avatarBtn) => {
  avatarBtn.addEventListener("click", showChampionInfo);
});

document.addEventListener("DOMContentLoaded", loadSkills);

// Fetch champion data
function fetchChampionData(championName) {
  return fetch("/data/champions.json")
    .then((response) => response.json())
    .then((data) => data.champions[championName])
    .catch((error) => console.error("Error fetching champion data:", error));
}

// Loading Skills on Playground
function loadSkills(e) {
  e.preventDefault();

  champions.forEach((champion, index) => {
    fetchChampionData(champion)
      .then((championData) => {
        Object.values(championData.skills).forEach((skill, i) => {
          const energyDiceContainer = document.getElementById(
            `skill${index * 4 + i + 1}`
          );
          if (energyDiceContainer) {
            createEnergyDice(skill.cost, energyDiceContainer);
          }
        });
      })
      .catch((error) =>
        console.error(`Error fetching data for ${champion}:`, error)
      );
  });
}

// Creating Energy Dices underneath skills
function createEnergyDice(cost, container) {
  const energyTypes = ["fire", "water", "earth", "wind", "light", "dark"];
  const energyDiceArray = cost.split("-");

  energyDiceArray.forEach((dice, index) => {
    for (let i = 0; i < Number(dice); i++) {
      const energyDice = document.createElement("div");
      energyDice.classList.add("energy-dice", energyTypes[index]);
      container.appendChild(energyDice);
    }
  });
}

// Fetch and load skill & champion info on info bar
function showSkillInfo(e) {
  e.preventDefault();
  const [focusedChampion, focusedSkill] = extractChampionSkill(e.target.src);

  fetchChampionData(focusedChampion)
    .then((championData) => {
      const skill = championData.skills[focusedSkill];
      const focusedSkillId = document.getElementById(
        championData.skills[focusedSkill].skillid
      );
      focusedSkillBorder(focusedSkillId);
      renderSkillInfo(skill);
      const backToChampionBtn = document.querySelector(".back-to-champion-btn");
      backToChampionBtn.addEventListener("click", () =>
        showChampionInfo(null, focusedChampion)
      );
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function showChampionInfo(e, championName = null) {
  e?.preventDefault();

  if (!championName) {
    championName = extractChampionSkill(e.target.src)[0];
  }

  fetchChampionData(championName).then((championData) => {
    renderChampionInfo(championName, championData);
  });
}

function focusedSkillBorder(focusedSkillId) {
  const allSkills = document.querySelectorAll(".img-skill");
  allSkills.forEach((skill) => {
    skill.classList.remove("highlighted-skill");
  });
  focusedSkillId.classList.add("highlighted-skill");
  selectedSkill = focusedSkillId;
}

// Globalny nasłuchiwacz kliknięć
document.addEventListener("click", (e) => {
  // Sprawdź, czy kliknięty element NIE jest skill-em
  if (!e.target.classList.contains("img-skill")) {
    // Usuń podświetlenie ze wszystkich skilli
    const allSkills = document.querySelectorAll(".img-skill");
    allSkills.forEach((skill) => {
      skill.classList.remove("highlighted-skill");
    });
  }
});

// Render skill & champion info on info bar

function renderSkillInfo(skill) {
  const skillCost = createSkillCostHtml(skill.cost);
  infoBar.innerHTML = `
    <div class="row">
      <div class="col-3">
        <div class="row info-img">
          <img class="p-0" src="/images/Champions/${skill.img}" alt="" />
        </div>
        <div class="row info-add">
          <div class="col info-energy">${skillCost}</div>
          <div class="col info-cooldown">Cd: ${skill.cd}</div>
        </div>
      </div>
      <div class="col-9 skill-description">
        <div class="row skill-name">${skill.name}</div>
        <div class="row skill-short-description">${skill.shortDsc}</div>
        <div class="row skill-long-description">${skill.longDsc}</div>
        <button class="row btn btn-default back-to-champion-btn">Go to champion</button>
      </div>
    </div>`;
}

function renderChampionInfo(championName, championData) {
  infoBar.innerHTML = `
    <div class="row info-image-row">
      <div class="col image-col">
        <img class="img-avatar info-img-avatar" src="/images/Champions/${championName}/${championName}-avatar.jpeg" alt="" />
      </div>
      ${[1, 2, 3, 4]
        .map(
          (i) => `
        <div class="col image-col">
          <img class="img-skill skill" src="/images/Champions/${championName}/${championName}-skill${i}.jpeg" alt="" />
        </div>
      `
        )
        .join("")}
    </div>
    <div class="row info-name-row">
      <div class="col info-name-col">${capitalizeFLetter(championName)}</div>
      ${[1, 2, 3, 4]
        .map(
          (i) => `
        <div class="col info-skill-name-col">
          <h6 class="m-0">${championData.skills[`skill${i}`].name}</h6>
          ${championData.skills[`skill${i}`].shortDsc}
        </div>
      `
        )
        .join("")}
    </div>`;

  const newSkillBtns = document.querySelectorAll(".skill");
  newSkillBtns.forEach((skillBtn) => {
    skillBtn.addEventListener("click", showSkillInfo);
  });
}

// Additional functions to read and control data

function createSkillCostHtml(cost) {
  const energyTypes = ["fire", "water", "earth", "wind", "light", "dark"];
  const energyDiceArray = cost.split("-");
  return energyDiceArray
    .map((dice, index) =>
      Array(Number(dice))
        .fill(`<div class="energy-dice ${energyTypes[index]}"></div>`)
        .join("")
    )
    .join("");
}

function extractChampionSkill(url) {
  const parts = url.split("/");
  const [champion, skill] = parts[parts.length - 1].split(".")[0].split("-");
  return [champion.toLowerCase(), skill];
}

function capitalizeFLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

// Sample of skills usage [WORKING SECTION !!!]

class Skill {
  constructor(name, damage, damageAOE, cd, cost) {
    this.name = name;
    this.damage = damage;
    this.damageAOE = damageAOE;
    this.cd = cd;
    this.cost = cost;
  }

  applyDamage(targets) {
    if (!Array.isArray(targets)) {
      targets = [targets]; // Convert single target to an array for consistency
    }

    targets.forEach((target) => {
      const damage =
        this.damageAOE !== undefined ? this.damageAOE : this.damage;
      console.log(`${this.name} is applied to ${target.name}`);
      target.takeDamage(damage);
    });
  }
}

class Target {
  constructor(name, health) {
    this.name = name;
    this.health = health;
  }

  takeDamage(damage) {
    this.health -= damage;
    console.log(
      `${this.name} took ${damage} damage. Health is now ${this.health}`
    );

    const hpElements = document.querySelectorAll(".hp"); // Lepiej użyć querySelectorAll
    hpElements.forEach((element) => {
      if (element.getAttribute("data-target-name") === this.name) {
        element.textContent = `${this.health}/100`; // Aktualizacja wyświetlanego zdrowia
      }
    });
  }
}

function loadSkillAndApply(championName, skillName, target) {
  fetch("/data/champions.json")
    .then((response) => response.json())
    .then((data) => {
      const skillData = data.champions[championName].skills[skillName];
      if (!skillData) {
        console.error(`Skill not found for ${championName}`);
        return;
      }

      const skill = new Skill(
        skillData.name,
        skillData.damage,
        skillData.damageAOE,
        skillData.cd,
        skillData.cost
      );

      const targets =
        skillData.damageAOE !== undefined
          ? Array.from(document.querySelectorAll(".enemy")).map(
              (enemy) => new Target(enemy.alt, 100)
            )
          : target; // Use either all enemies or single target

      skill.applyDamage(targets); // Apply damage to the relevant target(s)
    })
    .catch((error) => console.error("Error loading skill data:", error));
}

// Set up event listeners for all enemies
const enemies = document.querySelectorAll(".enemy");

enemies.forEach((enemy) => {
  enemy.addEventListener("click", handleEnemyClick);
});

function handleEnemyClick(e) {
  const enemyName = e.target.alt;

  if (!selectedSkill) {
    console.log("Choose a skill first");
    return;
  }

  const [focusedChampion, focusedSkill] = extractChampionSkill(
    selectedSkill.src
  );

  fetchChampionData(focusedChampion)
    .then((championData) => {
      const skillData = championData.skills[focusedSkill];
      if (skillData) {
        console.log(
          `${capitalizeFLetter(focusedChampion)} użył ${
            skillData.name
          } na ${enemyName}`
        );
        const enemyTarget = new Target(enemyName, 100);
        loadSkillAndApply(focusedChampion, focusedSkill, enemyTarget);
        selectedSkill = null;
      } else {
        console.log("Skill not found");
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Example helper functions

function extractChampionSkill(url) {
  const parts = url.split("/");
  const [champion, skill] = parts[parts.length - 1].split(".")[0].split("-");
  return [champion.toLowerCase(), skill];
}

function capitalizeFLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function fetchChampionData(championName) {
  return fetch("/data/champions.json")
    .then((response) => response.json())
    .then((data) => data.champions[championName])
    .catch((error) => console.error("Error fetching champion data:", error));
}
