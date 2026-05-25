document.addEventListener("DOMContentLoaded", function () {
  var revealItems = document.querySelectorAll(
    ".about-intro, .about-statement, .strength-card, .about-cta"
  );

  if (!revealItems.length) {
    return;
  }

  revealItems.forEach(function (item) {
    item.classList.add("about-reveal");
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
});
