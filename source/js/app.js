function toggleClass(event, className) {
  event.currentTarget.classList.toggle(className);
}

// HACK: Prevent gradient ID conflicts in level indicators
var levelIndicators = document.querySelectorAll(".level-indicator");

if (levelIndicators) {
  var indicatorIndex = 0;
  levelIndicators.forEach(function(ind) {
    ind
      .getElementById("radial-teal")
      .setAttribute("id", "radial-teal-" + indicatorIndex);
    ind
      .getElementById("radial-blue")
      .setAttribute("id", "radial-blue-" + indicatorIndex);
    ind
      .querySelector(".incomplete")
      .setAttribute("stroke", "url(#radial-blue-" + indicatorIndex + ")");
    ind
      .querySelector(".complete")
      .setAttribute("stroke", "url(#radial-teal-" + indicatorIndex + ")");
    indicatorIndex++;
  });
}

/**
 * Password Strength Calculation and Formatting
 */
var password = document.querySelector("input[type='password']");
var meter = document.querySelector(".password-meter");

if (password && meter) {
  password.addEventListener("input", function() {
    var val = password.value;
    var result = zxcvbn(val);

    if (val === "") {
      meter.setAttribute("data-password-strength", "");
    } else {
      meter.setAttribute("data-password-strength", result.score.toString());
    }
  });
}

/**
 * Search input
 */
var searchInput = document.querySelector(".search-input");
var searchField = document.getElementById("search");

if (searchField) {
  var cancel = document.querySelector(".search-input .cancel");

  var floatingCta = document.querySelector(".btn-floating-cta");
  var tapBar = document.querySelector(".tap-bar");

  var searchPage = document.querySelector(".page.show-search");

  searchField.addEventListener("input", function(e) {
    var searchTerm = e.target.value;

    if (searchTerm === "" && searchInput.classList.contains("active")) {
      searchInput.classList.remove("active");
      searchPage.classList.remove("search-active");
      hideSearchOptions(searchInput);
    } else if (!searchInput.classList.contains("active")) {
      searchInput.classList.add("active");
      searchPage.classList.add("search-active");
      showSearchOptions(searchInput);
    }
  });

  searchField.addEventListener("focus", function() {
    floatingCta.classList.add("hidden");
    tapBar.classList.add("hidden");
  });

  searchField.addEventListener("blur", function() {
    floatingCta.classList.remove("hidden");
    tapBar.classList.remove("hidden");
  });

  cancel.addEventListener("click", function() {
    var searchResults = document.querySelector(".search__results");
    searchResults.style.display = "none";
    searchField.value = "";
    searchInput.classList.remove("active");
    floatingCta.classList.remove("hidden");
    tapBar.classList.remove("hidden");
    searchPage.classList.remove("search-active");
    hideSearchOptions(searchInput);
  });
}

function showSearchOptions(wrapperElem) {
  var searchOptions = wrapperElem.querySelector(".search__options");
  var tl = new gsap.timeline({
    onComplete: function() {
      searchOptions.style.zIndex = 1;
    }
  });

  tl.to(searchOptions, { duration: 0.4, top: 0 }, 0);
  tl.to(searchOptions, { duration: 0.2, opacity: 1 }, 0.1);
}

function hideSearchOptions(wrapperElem) {
  var searchOptions = wrapperElem.querySelector(".search__options");
  searchOptions.style.zIndex = -1;
  var tl = new gsap.timeline();

  tl.to(searchOptions, { duration: 0.4, top: "-52px" }, 0);
  tl.to(searchOptions, { duration: 0.1, opacity: 0 }, 0.2);
}

function updateSearchResults(event) {
  var target = event.target;
  var filter = target.getAttribute("data-filter");
  var searchResults = document.querySelector(".search__results");

  if (!filter) return;

  var filterLinks = document.querySelectorAll(".search__options .btn.active");
  var tl = new gsap.timeline();

  filterLinks.forEach(function(link) {
    link.classList.remove("active");
  });

  target.classList.add("active");

  if (filter === "feed") {
    searchResults.style.display = "none";
    var listings = document.querySelectorAll(".status");
  } else if (filter === "profiles") {
    searchResults.style.display = "block";
    var listings = searchResults.querySelectorAll(".person-listing");
  } else {
    listings = [];
  }

  listings.forEach(function(listing, idx) {
    listing.style.position = "relative";
    tl.from(
      listing,
      { duration: 0.4, left: "100vw", ease: Power3.easeOut },
      idx * 0.02
    );
  });
}

/**
 * New Post
 */

// Visibility toggle
var toggleButton = document.querySelector(".new-post-header .btn-outline");

if (toggleButton) {
  var visibilityMessage = document.querySelector(
    ".new-post-header .visibility"
  );

  toggleButton.addEventListener("click", function() {
    var visibility = toggleButton.getAttribute("data-visibility");
    if (visibility === "public") {
      toggleButton.innerHTML = "Protected";
      toggleButton.setAttribute("data-visibility", "protected");
      toggleButton.classList.remove("muted");
      visibilityMessage.textContent = "Visible to followers only";
    } else {
      toggleButton.innerHTML = "Public";
      toggleButton.setAttribute("data-visibility", "public");
      toggleButton.classList.add("muted");
      visibilityMessage.textContent = "Visible to everyone";
    }
  });
}

// Post input
var postInput = document.getElementById("post-content");

if (postInput) {
  var submitButton = document.getElementById("post");

  postInput.addEventListener("keydown", function(e) {
    if (e.key.toUpperCase() === "ENTER") return postStatus(e);

    var input = e.target.value;

    if (input !== "") {
      if (toggleButton) toggleButton.classList.remove("muted");
      submitButton.classList.remove("btn-disabled");
    } else {
      if (toggleButton) toggleButton.classList.add("muted");
      submitButton.classList.add("btn-disabled");
    }
  });
}

function postStatus(event) {
  event.stopPropagation();
  event.preventDefault();

  if (!postInput) return;

  postInput.value = "";
  if (toggleButton) toggleButton.classList.add("muted");
  if (submitButton) submitButton.classList.add("btn-disabled");
}

/**
 * Messaging
 */

function chatKeydownHandler(event) {
  if (event.key.toUpperCase() === "ENTER") return postMessage(event);
}

function postMessage(event) {
  event.stopPropagation();
  event.preventDefault();

  var messageInput = document.getElementById("message-input");
  messageInput.value = "";
  messageInput.focus();

  addChatMessage();
}

/**
 * Feed Menu
 */
var overlayListener;
var overlay;

var toggleFeedMenu = function() {
  if (window.innerWidth >= 1024) return;

  var feedMenu = document.querySelector(".menu-drawer");

  if (!feedMenu) return;

  if (feedMenu.classList.contains("active")) {
    feedMenu.classList.remove("active");
    removeOverlay();
  } else {
    feedMenu.classList.add("active");
    addOverlay();
  }
};

function addOverlay() {
  overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  overlayListener = overlay.addEventListener("click", toggleFeedMenu);
}

function removeOverlay() {
  if (!overlay) return;

  if (overlayListener) overlay.removeEventListener(overlayListener);

  overlay.parentNode.removeChild(overlay);
  overlay = null;
}

/**
 * Profile Header
 */
function getDashOffset(levelIndicator, completeBar) {
  if (!levelIndicator || !completeBar) return;

  var percent = parseInt(levelIndicator.getAttribute("data-percentage"));
  var radius = parseInt(completeBar.getAttribute("r"));
  var circumference = 2 * Math.PI * radius;

  return circumference - (percent * circumference) / 100;
}

function setProgressBar() {
  var levelIndicator = document.querySelectorAll(
    ".profile-avatar .level-indicator"
  );

  levelIndicator.forEach(function(indicator) {
    var completeBar = indicator.querySelector(".complete");
    var dashOffset = getDashOffset(indicator, completeBar);

    gsap.to(completeBar, { duration: 1, "stroke-dashoffset": dashOffset });
  });
}

setProgressBar();

var profilePage = document.querySelector(".page-profile");

if (profilePage) {
  (function initHeaderProfileAnimation() {
    var headerContainer = document.querySelector(".profile-header-container");
    var avatarWrapper = headerContainer.querySelector(".profile-avatar");
    var profileName = headerContainer.querySelector(".profile-name");
    var profileMeta = headerContainer.querySelector(".profile-meta");
    var actions = headerContainer.querySelector(".profile-actions");
    /* var profileHeader = document.querySelector(".profile-header");
    var levelIndicator = profileHeader.querySelector(
      ".profile-avatar .level-indicator"
    );
    var completeBar = levelIndicator.querySelector(".complete");
    var onlineIndicator = profileHeader.querySelector(
      ".profile-avatar .online-indicator"
    );
    var buttons = profileHeader.querySelectorAll(".profile-actions .btn");
    var buttonContents = profileHeader.querySelectorAll(
      ".profile-actions .btn .btn-inner"
    );

    var tl = new gsap.timeline();

    tl.to(avatarWrapper, { duration: 0.75, width: 0, height: 0 });
    tl.to(
      completeBar,
      { duration: 0.5, "stroke-dashoffset": 540.3539364174444 },
      0
    );
    tl.to(
      onlineIndicator,
      {
        duration: 0.5,
        width: 0,
        height: 0,
        "border-width": 2,
        "margin-top": 0,
        "margin-left": 0
      },
      0
    );
    tl.to(profileName, { duration: 0.75, "margin-top": -3 }, 0);
    tl.to(actions, { duration: 0.75, "margin-top": 0 }, 0);
    buttons.forEach(function(btn) {
      tl.to(btn, { duration: 0.5, height: 0, padding: 0 }, 0);
    });
    buttonContents.forEach(function(btnInner) {
      tl.to(btnInner, { duration: 0.18, opacity: 0 }, 0);
    });

    var controller = new ScrollMagic.Controller({
      refreshInterval: 0
    });

    var scene = new ScrollMagic.Scene({
      duration: 175,
      triggerElement: document.getElementById("scroll-trigger")
    });

    scene.setTween(tl).addTo(controller);

    window.addEventListener("resize", function() {
      scene.refresh();
    }); */

    var tl = new gsap.timeline();

    // tl.to(headerContainer, { duration: 1, height: 26 }, 0);
    tl.to(avatarWrapper, { duration: 1, top: -86 }, 0);
    tl.to(profileName, { duration: 1, top: -86 }, 0);
    tl.to(profileMeta, { duration: 1, top: -86 }, 0);
    tl.to(actions, { duration: 1, top: -86 }, 0);

    var controller = new ScrollMagic.Controller({
      refreshInterval: 0
    });

    var scene = new ScrollMagic.Scene({
      duration: 175,
      triggerElement: document.getElementById("scroll-trigger")
    });

    scene.setTween(tl).addTo(controller);

    window.addEventListener("resize", function() {
      scene.refresh();
    });
  })();
}

/**
 * Stat Meters
 */
var statColumns = document.querySelectorAll(".stat-meter-column");

if (statColumns) {
  var columnTimeline = new gsap.timeline();
  statColumns.forEach(function(col, idx) {
    var colValue = parseInt(col.getAttribute("data-count"));
    var colMax = parseInt(col.getAttribute("data-max-count"));
    var parentHeight = col.parentNode.clientHeight;

    var countPercent = colValue / colMax;

    columnTimeline.to(
      col,
      { duration: 2 * countPercent, height: parentHeight * countPercent },
      0
    );
  });

  var statController = new ScrollMagic.Controller({
    refreshInterval: 0
  });
  var scene = new ScrollMagic.Scene({
    tweenChanges: true,
    triggerElement: document.querySelector(".weekly-stats"),
    triggerHook: 1,
    offset: 86,
    reverse: false
  });

  scene.setTween(columnTimeline).addTo(statController);

  window.addEventListener("resize", function() {
    scene.refresh();
  });
}

/**
 * Modals
 */

function closeShareModal() {
  document
    .querySelector(".social-share-modal.active")
    .classList.remove("active");
}

/**
 * Achievement Badges
 */
var achievements = document.querySelectorAll(".achievement .level-indicator");

if (achievements) {
  var badgeTl = new TimelineMax();
  achievements.forEach(function(badge) {
    var percent = parseInt(badge.getAttribute("data-percentage"));
    if (!percent && percent !== 0) return;

    var completeBar = badge.querySelector(".complete");
    var dashOffset = getDashOffset(badge, completeBar);
    badgeTl.to(completeBar, 1, { "stroke-dashoffset": dashOffset }, 0);
  });
}

/**
 * Show loader
 */
var showLoadingIndicator = function() {
  var indicator = document.querySelector(".loading-indicator");
  var button = document.querySelector(".join-modal .modal-content .btn.mv-24");
  indicator.classList.toggle("active");
  if (button.classList.contains("bg-teal")) {
    button.innerHTML = "Cancel Request";
  } else {
    button.innerHTML = "Send Request";
  }
  button.classList.toggle("bg-teal");
  button.classList.toggle("bg-black");
};

/**
 * Setting Toggle Class Updater
 */
var toggleSettingClass = function(e) {
  var input = e.currentTarget;
  var parent = input.parentElement;
  while (
    parent.parentElement &&
    (!parent || !parent.classList.contains("setting-toggle"))
  ) {
    parent = parent.parentElement;
  }

  if (parent && parent.classList.contains("setting-toggle"))
    parent.classList.toggle("on");
};

/**
 * Setting Toggle Class Updater
 */
var toggleCheckboxClass = function(e) {
  var input = e.currentTarget;
  var parent = input.parentElement;
  while (
    parent.parentElement &&
    (!parent || !parent.classList.contains("checkbox"))
  ) {
    parent = parent.parentElement;
  }

  if (parent && parent.classList.contains("checkbox"))
    parent.classList.toggle("checked");
};

/**
 * Custom select
 */
var customSelects = document.querySelectorAll(".custom-select");

if (customSelects) {
  customSelects.forEach(function(el) {
    el.addEventListener("change", function(e) {
      var val = e.target.value;
      if (val) el.classList.add("selected");
    });
  });
}

/**
 * Notifications page
 */
var notificationsPage = document.querySelector(".page-notifications");
var notificationsSwipeUpListener, notificationsSwipeDownListener;

function enableNotificationsSwipeUpListener() {
  notificationsSwipeUpListener = new Hammer.Manager(notificationsPage, {
    touchAction: "auto"
  });
  notificationsSwipeUpListener.add(
    new Hammer.Swipe({ direction: Hammer.DIRECTION_UP })
  );

  notificationsPage.style.touchAction = "pan-up";

  notificationsSwipeUpListener.on("swipeup", function() {
    notificationsSwipeUpListener.destroy();
    enableNotificationsSwipeDownListener();
    document.querySelector(".clear").classList.remove("show");
  });
}

function enableNotificationsSwipeDownListener() {
  notificationsSwipeDownListener = new Hammer.Manager(notificationsPage, {
    touchAction: "auto"
  });
  notificationsSwipeDownListener.add(
    new Hammer.Swipe({ direction: Hammer.DIRECTION_DOWN })
  );

  notificationsPage.style.touchAction = "pan-down";

  notificationsSwipeDownListener.on("swipedown", function() {
    notificationsSwipeDownListener.destroy();
    enableNotificationsSwipeUpListener();
    document.querySelector(".clear").classList.add("show");
  });
}

if (notificationsPage) {
  enableNotificationsSwipeDownListener();
}

/**
 * Messages page
 */
var messages = document.querySelectorAll(".message-item");

if (messages) {
  messages.forEach(function(message) {
    var mc = new Hammer(message);
    mc.on("swipeleft", function(e) {
      message.classList.add("swiped");
    });

    mc.on("swiperight", function(e) {
      message.classList.remove("swiped");
    });
  });
}

/**
 * Saved search page
 */
var searchTemplates = document.querySelectorAll(".search-template-item");

if (searchTemplates) {
  searchTemplates.forEach(function(t) {
    var mc = new Hammer(t);
    mc.on("swipeleft", function(e) {
      t.classList.add("swiped");
    });

    mc.on("swiperight", function(e) {
      t.classList.remove("swiped");
    });
  });
}

/**
 * Partie template page
 */
var partieTemplates = document.querySelectorAll(".partie-item.has-remove");

if (partieTemplates) {
  partieTemplates.forEach(function(t) {
    var mc = new Hammer(t);
    mc.on("swipeleft", function(e) {
      t.classList.add("swiped");
    });

    mc.on("swiperight", function(e) {
      t.classList.remove("swiped");
    });
  });
}

/**
 * Account page
 */
var partnerProgressBar = document.querySelector(
  ".partner-progress .progress-bar"
);

if (partnerProgressBar) {
  var percentComplete =
    partnerProgressBar.getAttribute("data-progress-percent") + "%";
  partnerProgressBar.style.setProperty(
    "--progress-bar-percent",
    percentComplete
  );
}

/**
 * Edit Profile Page
 */

var platformsSelect = document.querySelector(".platforms-select");

if (platformsSelect) {
  platformsSelect.addEventListener("click", function(e) {
    e.preventDefault();
    openModal("#platforms-modal");
  });
}

/**
 * Masonry
 */

function resizeMasonryItem(item, animate) {
  if (window.innerWidth < 1024) {
    item.style.gridRowEnd = "unset";
    return;
  }

  var grid = document.querySelector("main.content");
  if (grid) {
    var rowGap = parseInt(
        window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
      ),
      rowHeight = parseInt(
        window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
      ),
      bodyHeight,
      metaHeight;

    var paddingHeight = item.classList.contains("status-cta") ? 0 : 56;

    try {
      bodyHeight = item.querySelector(".status-body").getBoundingClientRect()
        .height;
    } catch (e) {
      bodyHeight = 0;
    }

    try {
      metaHeight = item.querySelector(".status-meta").getBoundingClientRect()
        .height;
    } catch (e) {
      metaHeight = 0;
    }

    var rowSpan = Math.ceil(
      (bodyHeight + metaHeight + paddingHeight + rowGap) / (rowHeight + rowGap)
    );

    if (animate) {
      gsap.to(item, { duration: 0.2, "grid-row-end": "span " + rowSpan });
    } else {
      item.style.gridRowEnd = "span " + rowSpan;
    }
  }
}

/**
 * Apply spanning to all the masonry items
 *
 * Loop through all the items and apply the spanning to them using
 * `resizeMasonryItem()` function.
 *
 * @uses resizeMasonryItem
 * @link https://w3bits.com/css-grid-masonry/
 */
function resizeAllMasonryItems(suppressAnimation) {
  var allItems = document.querySelectorAll(".status");

  if (allItems) {
    for (var i = 0; i < allItems.length; i++) {
      resizeMasonryItem(allItems[i]);
    }

    for (var i = 0; i < allItems.length; i++) {
      allItems[i].classList.remove("v-hidden");
    }

    if (suppressAnimation !== true) enterFromBottom(allItems);
  }
}

/**
 * Resize the items when all the images inside the masonry grid
 * finish loading. This will ensure that all the content inside our
 * masonry items is visible.
 *
 * @uses ImagesLoaded
 * @uses resizeMasonryItem
 * @link https://w3bits.com/css-grid-masonry/
 */
function waitForImagesAndResize() {
  var grid = document.querySelector("main.content");

  if (window.innerWidth < 1024 && grid) {
    imagesLoaded(grid, function() {
      resizeAllMasonryItems();
    });
  } else if (grid) {
    var allItems = grid.querySelectorAll(".status");
    enterFromBottom(allItems);
  }
}

window.addEventListener("load", resizeAllMasonryItems);
window.addEventListener("resize", resizeAllMasonryItems.bind(this, true));

/**
 * User Actions Menu
 */

var popper;

function activateUserActionsPopper(event) {
  if (popper) {
    popper.destroy();
    popper = null;
    if (event) event.currentTarget.classList.remove("active");
    else document.querySelector(".link-more").classList.remove("active");
  } else if (window.innerWidth >= 1024) {
    var button = event
      ? event.currentTarget
      : document.querySelector(".link-more");
    if (!button) return;

    var menu = document.querySelector(".menu-drawer");
    popper = new Popper(button, menu);
    button.classList.add("active");
  }
}

window.addEventListener("resize", function() {
  var feedMenu = document.querySelector(".menu-drawer");
  if (window.innerWidth < 1024 && popper) {
    popper.destroy();
    popper = null;
    document.querySelector(".link-more").classList.remove("active");
    toggleFeedMenu();
  } else if (
    window.innerWidth >= 1024 &&
    feedMenu.classList.contains("active")
  ) {
    feedMenu.classList.remove("active");
    removeOverlay();
    activateUserActionsPopper();
  }
});

/**
 * Account Navigation
 */
function accountNavigation(pageId, pageTitle, modalTarget, linkTarget) {
  if (window.innerWidth >= 1024) {
    var pages = document.querySelectorAll(".settings-page.active");
    var newPage = document.querySelector(pageId);
    var activeItem = document.querySelector(".account-option.active");
    var newLink = document.querySelector(pageId + "-link");
    var pageHeading = document.querySelector(".settings-header h2");

    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove("active");
    }

    if (newPage) newPage.classList.add("active");
    if (activeItem) activeItem.classList.remove("active");
    if (newLink) newLink.classList.add("active");
    pageHeading.innerText = pageTitle;
  } else if (modalTarget) {
    openModal(modalTarget);
  } else if (linkTarget) {
    window.location = linkTarget;
  }
}

/**
 * Store 'View All' Behavior
 */
function viewAllProducts(event) {
  if (window.innerWidth >= 1024) {
    event.preventDefault();
    openModal("#new-releases-modal");
  }
}

/**
 * Notifications Tray
 */
function toggleNotificationsTray(event) {
  if (window.innerWidth >= 1200) {
    if (event) event.preventDefault();
    var tray = document.querySelector(".notifications-tray");
    if (tray) tray.classList.toggle("active");
  }
}

/**
 * Date Selector
 */
var birthdayInput = document.getElementById("birthdate");
if (birthdayInput) {
  var datepicker = datepicker(birthdayInput, {
    formatter: function(input, date) {
      input.value = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        day: "numeric"
      });
    }
  });
}

/**
 * Messages menu
 */
function openMessageOptions(event) {
  event.stopPropagation();

  event.currentTarget.parentElement.classList.toggle("menu-active");

  if (window.innerWidth < 1024) {
    var feedMenu = document.getElementById("message-menu");

    if (feedMenu.classList.contains("active")) {
      feedMenu.classList.remove("active");
      if (overlay && overlayListener)
        overlay.removeEventListener(overlayListener);
      if (overlay) {
        overlay.parentNode.removeChild(overlay);
        overlay = null;
      }
    } else {
      feedMenu.classList.add("active");
      overlay = document.createElement("div");
      overlay.className = "overlay";
      document.body.appendChild(overlay);
      overlayListener = overlay.addEventListener("click", toggleFeedMenu);
    }
  } else {
    if (popper) {
      popper.destroy();
      popper = null;
    } else {
      var button = event.currentTarget;
      var menu = document.getElementById("message-menu");
      popper = new Popper(button, menu, { placement: "bottom-end" });
    }
  }
}

// Close modals on ESC keypress
document.addEventListener("keydown", function(event) {
  if (event.key.toUpperCase() === "ESCAPE") closeModal();
});

// Close modals on click away
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("modal-overlay")) {
    closeModal(event.target.parentElement);
  }
});

// Image slider

var sliderContainer = document.getElementById("image-carousel");

if (sliderContainer) initImageCarousel(sliderContainer);

function initImageCarousel(container) {
  var headerText = document.querySelector("header h1");
  var slider = Peppermint(container, {
    onSlideChange: function(slideIndex) {
      var slideNumber = slideIndex + 1;
      headerText.innerText = slideNumber + "/5";
    }
  });
}

function openLightboxModal(linkUri) {
  if (window.innerWidth < 1200) {
    window.location = linkUri;
    return;
  }

  var modal = document.getElementById("lightbox-modal");
  modal.classList.add("active");
  initModalCarousel(document.getElementById("modal-carousel"));
}

function initModalCarousel(container) {
  var headerText = document.querySelector("#lightbox-modal .modal-title");
  var slider = Peppermint(container, {
    onSlideChange: function(slideIndex) {
      var slides = container.querySelectorAll("figure");
      var image = slides[slideIndex].querySelector("img");
      container.querySelector(".peppermint-slides").style.height =
        image.height + "px";
      var slideNumber = slideIndex + 1;
      headerText.innerText = slideNumber + "/5";
    }
  });

  var backButton = document.querySelector("#lightbox-modal .lightbox-back");
  var nextButton = document.querySelector("#lightbox-modal .lightbox-next");

  backButton.addEventListener("click", function() {
    slider.prev();
  });

  nextButton.addEventListener("click", function() {
    slider.next();
  });
}

// Search templates

function toggleTray(selector) {
  var tray = document.querySelector(selector);
  var allTrays = document.querySelectorAll(".tray");

  if (!tray) return;

  var trayIsActive = tray.classList.contains("active");

  if (allTrays && allTrays.length) {
    for (var i = 0; i < allTrays.length; i++) {
      allTrays[i].classList.remove("active");
    }
  }

  if (!trayIsActive) tray.classList.add("active");
}

function navigateOrTray(pageUrl, selector) {
  if (window.innerWidth < 1200) {
    window.location = pageUrl;
  } else {
    toggleTray(selector);
  }
}

function openPartieSearch(linkUrl) {
  if (window.innerWidth < 1200) {
    window.location = linkUrl;
  } else {
    toggleTray(".new-search-tray");
  }
}

/**
 * ANIMATION
 */

// Landing Page Background

var iconBackground =
  document.querySelector(".icon-background") ||
  document.querySelector(".modal.rate-modal .modal-container");

if (iconBackground) {
  gsap.to(iconBackground, {
    duration: 120,
    "background-position-y": "12000%",
    ease: "linear",
    repeat: 1000
  });
}

// Landing page content entry

var landingPage = document.getElementById("landing-page");

if (landingPage) {
  var logo = landingPage.querySelector(".logo");
  var textMain = landingPage.querySelector(".text-main");
  var textSecondary = landingPage.querySelector(".text-secondary");
  var btnGroup = landingPage.querySelector(".btn-group");
  var contact = landingPage.querySelector(".contact");
  logo.style.position = "relative";
  logo.style.top = window.innerWidth < 1024 ? "30vh" : "50vh";
  logo.style.transform = "rotateX(20deg)";
  textMain.style.position = "relative";
  textSecondary.style.position = "relative";
  btnGroup.style.position = "relative";
  contact.style.position = "relative";

  var logoWidth = gsap.getProperty(logo, "width");
  var logoTopMidpoint = window.innerWidth < 1024 ? "22vh" : "calc(50vh - 96px)";

  var tlLandingPage = new gsap.timeline({});

  window.lpTimeline = tlLandingPage
    .to(logo, { duration: 0, width: logoWidth * 1.18 }, 0)
    .to(logo, { duration: 0.2, width: logoWidth * 1.39 }, 1)
    .to(logo, { duration: 0.4, width: logoWidth }, 2.75)
    .to(logo, { duration: 0.25, top: logoTopMidpoint, ease: Power2.easeOut }, 1)
    .from(logo, { duration: 0.15, opacity: 0, ease: Power1.easeOut }, 1)
    .to(logo, { duration: 1, top: "auto", ease: Power2.easeOut }, 2.6)
    .to(logo, { duration: 0.25, transform: "rotateX(0)" }, 1)
    .from(textMain, { duration: 0.26, top: "50vh", ease: Power2.easeOut }, 3)
    .from(textMain, { duration: 0.26, opacity: 0, ease: Power1.easeOut }, 3)
    .from(
      textSecondary,
      { duration: 0.75, top: "50vh", ease: Power2.easeOut },
      2.5
    )
    .from(
      textSecondary,
      { duration: 0.75, opacity: 0, ease: Power1.easeOut },
      2.5
    )
    .from(btnGroup, { duration: 0.75, top: "50vh", ease: Power2.easeOut }, 2.5)
    .from(btnGroup, { duration: 0.75, opacity: 0, ease: Power1.easeOut }, 2.5)
    .from(contact, { duration: 0.75, top: "50vh", ease: Power2.easeOut }, 3)
    .from(contact, { duration: 0.75, opacity: 0, ease: Power1.easeOut }, 3);
}

// Modal Entry

function openModal(selector, animateContents) {
  var modal = document.querySelector(selector);
  var overlay = modal.querySelector(".modal-overlay");
  var container = modal.querySelector(".modal-container");
  modal.classList.add("active");

  var tlOpenModal = new gsap.timeline({});

  tlOpenModal
    .from(overlay, {
      duration: 0.5,
      opacity: 0,
      ease: Power3.easeOut
    })
    .from(
      container,
      {
        duration: 1,
        top: "100vh",
        ease: Bounce.easeOut
      },
      0
    )
    .from(
      container,
      {
        duration: 0.5,
        opacity: 0,
        ease: Power3.easeOut
      },
      0
    );

  if (animateContents) {
    var header = container.querySelector(".modal-header");
    var contents = container.querySelectorAll(".modal-content > *");
    tlOpenModal.to(
      header,
      { duration: 0.25, top: "auto", ease: Power3.easeOut },
      0.5
    );

    contents.forEach(function(elem, idx) {
      tlOpenModal.to(
        elem,
        { duration: 0.25, top: "auto", ease: Power3.easeOut },
        0.5 + (idx + 1) * 0.02
      );
    });
  }
}

// Modal Exit

function closeModal(selector) {
  var modal =
    selector instanceof Element
      ? selector
      : document.querySelector(selector || ".modal.active");
  var overlay = modal.querySelector(".modal-overlay");
  var container = modal.querySelector(".modal-container");

  var header = container.querySelector(".modal-header");
  var contents = container.querySelectorAll(".modal-content > *");

  header.style.top = "";
  contents.forEach(function(elem) {
    elem.style.top = "";
  });

  var tlCloseModal = new gsap.timeline({
    onComplete: function() {
      modal.classList.remove("active");
      overlay.style.opacity = "";
      container.style.top = "";
    }
  });

  tlCloseModal.to(overlay, { duration: 0.25, opacity: 0 }, 0).to(
    container,
    {
      duration: 0.4,
      top: "150vh",
      ease: Power3.easeOut
    },
    0
  );
}

// Home feed

function enterFromBottom(elems) {
  var tl = new gsap.timeline({
    onComplete: function() {
      elems.forEach(function(elem) {
        elem.style.top = "";
      });
    }
  });

  elems.forEach(function(elem, idx) {
    elem.style.position = "relative";
    tl.from(
      elem,
      { duration: 0.5, top: "100vh", ease: Power3.easeOut },
      idx * 0.05
    );
  });
}

// Animated logo

function createLogoAnimation(elem) {
  lottie.loadAnimation({
    container: elem,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "/animations/partie_logo.json"
  });
}

function showFeedLoader() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("status", "status-loader");
  const statusBody = document.createElement("div");
  statusBody.classList.add("status-body");
  const animationContainer = document.createElement("div");
  animationContainer.id = "animation-container";
  statusBody.appendChild(animationContainer);
  wrapper.appendChild(statusBody);

  var feedContainer = document.querySelector(".content-feed");
  var firstStatus = feedContainer.querySelector(".status");

  feedContainer.insertBefore(wrapper, firstStatus);
  resizeMasonryItem(wrapper, true);
  createLogoAnimation(animationContainer);
}

function animateListItems(selector) {
  var items = document.querySelectorAll(selector);

  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove("v-hidden");
  }

  enterFromBottom(items);
}

// Add chat message

function addChatMessage() {
  if (!("content" in document.createElement("template"))) return;

  var template = document.getElementById("new-chat-message");
  if (!template) return;

  var messages = document.querySelector(".chat-messages");
  var clone = document.importNode(template.content, true);
  messages.appendChild(clone);

  if (window.innerWidth < 1024) {
    window.scrollTo(0, document.body.scrollHeight);
  } else {
    var mainContainer = document.querySelector("main.content");
    mainContainer.scrollTo(0, mainContainer.scrollHeight);
  }

  var message = messages.querySelector(".chat-message:last-of-type");

  var tl = new gsap.timeline();
  tl.from(message, { duration: 0.5, top: "100vh", ease: Power3.easeOut }, 0);

  message.classList.remove("v-hidden");
}

// Rate Modal

var rateModalContainer = document.querySelector(
  ".modal.rate-modal .modal-container"
);

if (rateModalContainer) {
  var modalHeader = rateModalContainer.querySelector(".modal-header");
  var modalContents = rateModalContainer.querySelectorAll(".modal-content > *");

  var rateTimeline = new gsap.timeline();

  rateTimeline.to(
    modalHeader,
    { duration: 0.5, left: "auto", ease: Power3.easeOut },
    0
  );
  modalContents.forEach(function(elem, idx) {
    rateTimeline.to(
      elem,
      { duration: 0.5, left: "auto", ease: Power3.easeOut },
      (idx + 1) * 0.03
    );
  });
}

// New Post

function resizeTextarea(event) {
  var scrollHeight = event.target.scrollHeight;
  event.target.style.height = scrollHeight + "px";
}

function addImageToNewPost() {
  var form = document.querySelector(".page-new-post form");

  if (!form) return;

  var img = document.createElement("img");
  img.setAttribute("src", "/images/game-cover.png");
  img.setAttribute(
    "srcset",
    "/images/game-cover@2x.png 2x, /images/game-cover@3x.png 3x"
  );

  form.appendChild(img);

  var addedImage = form.querySelector("img");

  gsap.from(addedImage, { duration: 0.3, width: 0, ease: Power3.easeOut });
}
