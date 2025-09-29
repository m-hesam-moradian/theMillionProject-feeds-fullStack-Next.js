const url = "https://www.themillionproject.org/_functions/externalSubmit";

const payload = {
  name: "Sam Moradian",
  email: "sam@example.com",
  message: "Testing external submission",
};

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
})
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
