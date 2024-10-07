const openMenu = () => {
  document.querySelector(".nav").classList.toggle("active");
};

function navigate() {
  document.querySelector(".modal").classList.add("active");

  const phone = document.querySelector("#phone").value;
  const name = document.querySelector("#name").value;
  fetch(`/send_application.php?name=${name}&phone=${phone}`)
    .then((response) => response.text())
    .then((response) => console.log(response));
}

function back() {
  document.querySelector(".cb").classList.remove("active");
  window.location.href = "/";
}

function closeInf() {
  document.querySelector(".modalInf").classList.remove("active");
  window.location.href = "/";
}

const data = {};

function check() {
  const checker = document.querySelector(".checkbox").checked;
  document.querySelector(".send").disabled = !checker;
}

const form = document.querySelector(".forma");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  let value = Object.fromEntries(formData.entries());

  const keysWithNullValues = Object.keys(value).filter(
    (key) => value[key] === "" || value[key].includes("_")
  );

  if (keysWithNullValues.length) {
    document.querySelector(".inf").classList.add("active");
  } else {
    try {
      const response = await fetch("https://kanio.by/send_for_contract.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      const res = await response.json();
      document.querySelector(".information").innerHTML = res.message;

      // Print the HTML content if available
      if (res.html) {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(res.html);

        // Delay before printing to ensure all content is loaded
        setTimeout(() => {
          printWindow.print();
        }, 1000); // Adjust delay time as needed
      }

      document.querySelector(".modal").classList.add("active");
    } catch (error) {
      console.error("Ошибка при отправке формы: ", error);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  for (const el of document.querySelectorAll("[placeholder][data-slots]")) {
    const pattern = el.getAttribute("placeholder"),
      slots = new Set(el.dataset.slots || "_"),
      prev = ((j) =>
        Array.from(pattern, (c, i) => (slots.has(c) ? (j = i + 1) : j)))(0),
      first = [...pattern].findIndex((c) => slots.has(c)),
      accept = new RegExp(el.dataset.accept || "\\d", "g"),
      clean = (input) => {
        input = input.match(accept) || [];
        return Array.from(pattern, (c) =>
          input[0] === c || slots.has(c) ? input.shift() || c : c
        );
      },
      format = () => {
        const [i, j] = [el.selectionStart, el.selectionEnd].map((i) => {
          i = clean(el.value.slice(0, i)).findIndex((c) => slots.has(c));
          return i < 0
            ? prev[prev.length - 1]
            : back
            ? prev[i - 1] || first
            : i;
        });
        el.value = clean(el.value).join``;
        el.setSelectionRange(i, j);
        back = false;
      };
    let back = false;
    el.addEventListener("keydown", (e) => (back = e.key === "Backspace"));
    el.addEventListener("input", format);
    el.addEventListener("focus", format);
    el.addEventListener("blur", () => el.value === pattern && (el.value = ""));
  }
});
