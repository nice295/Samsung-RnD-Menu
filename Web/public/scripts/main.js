/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 'use strict';

// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
var signInButton = document.getElementById('sign-in-button');
var signInGuestButton = document.getElementById('sign-in-guest-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');
var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');
var lunchPostsSection = document.getElementById('lunch-posts-list'); //khlee
var recentPostsSection = document.getElementById('recent-posts-list');
var userPostsSection = document.getElementById('user-posts-list');
var topUserPostsSection = document.getElementById('top-user-posts-list');
var lunchMenuButton = document.getElementById('menu-lunch'); //khlee
var recentMenuButton = document.getElementById('menu-recent');
var myPostsMenuButton = document.getElementById('menu-my-posts');
var myTopPostsMenuButton = document.getElementById('menu-my-top-posts');
var menuCafe1 = document.getElementById('menu-cafe-1');
var menuCafe2 = document.getElementById('menu-cafe-2');
var textCafe = document.getElementById('text-cafe');
var listeningFirebaseRefs = [];
var foodImageMap = new Map();
var cateteriaNumber = "1식당";
/**
 * Saves a new post to the Firebase DB.
 */
// [START write_fan_out]
function writeNewPost(uid, username, picture, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
// [END write_fan_out]

/**
 * Star/unstar post.
 */
// [START post_stars_transaction]
function toggleStar(postRef, uid) {
  postRef.transaction(function(post) {
    if (post) {
      if (post.stars && post.stars[uid]) {
        post.starCount--;
        post.stars[uid] = null;
      } else {
        post.starCount++;
        if (!post.stars) {
          post.stars = {};
        }
        post.stars[uid] = true;
      }
    }
    return post;
  });
}
// [END post_stars_transaction]

function createMenuElement(restaurant, menu, description) {
  var html = 
      '<div class="mdl-card mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-shadow--2dp">'+
        '<figure class="mdl-card__media">'+
        '  <img class="item-image img-responsive" src="" alt="" />'+
        '</figure>'+
        '<div class="mdl-card__title mdl-color-text--orange mdl-card--border">'+
        '  <h3 class="item-restaurant">H5</h3>'+
        '</div>'+
        '<div class="mdl-card__title">'+
        '  <h5 class="item-menu">Learning Web Design</h5>'+
        '</div>'+
        '<div class="mdl-card__supporting-text">'+
        '  <p class="item-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam accusamus, consectetur.</p>'+
        '</div>'+
        '<div class="mdl-card__actions mdl-card--border">'+
        '  <!--<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Read More</a>-->'+
        '  <div class="mdl-layout-spacer"></div>'+
        '  <button class="mdl-button mdl-button--icon mdl-button--colored"><i class="material-icons">favorite_border</i></button>'+
        '  <button class="mdl-button mdl-button--icon mdl-button--colored"><i class="material-icons">share</i></button>'+
        '</div>'+
      '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;

  var image = foodImageMap.get(menu);
  console.log("image: " + image);
  
  // Set values.
  postElement.getElementsByClassName('item-restaurant')[0].innerText = restaurant;
  postElement.getElementsByClassName('item-menu')[0].innerText = menu;
  postElement.getElementsByClassName('item-description')[0].innerText = description;
  //postElement.getElementsByClassName('item-image')[0].style.backgroundImage = 'url("' +
  //(image || './images/no-image.jpg') + '")';  
  postElement.getElementsByClassName('item-image')[0].src = image || './images/no-image.jpg';  

  // add color text
  /*
  if (time == 0)
    postElement1.getElementsByClassName('item-name')[0].classList.add('mdl-color-text--orange');
  */

  return postElement;
}

/**
 * Creates a post element.
 */
 function createPostElement(postId, title, text, author, authorId, authorPic) {
  var uid = firebase.auth().currentUser.uid;

  var html =
  '<div class="post post-' + postId + ' mdl-cell mdl-cell--12-col ' +
  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
  '<div class="mdl-card mdl-shadow--2dp">' +
  '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
  '<h4 class="mdl-card__title-text"></h4>' +
  '</div>' +
  '<div class="header">' +
  '<div>' +
  '<div class="avatar"></div>' +
  '<div class="username mdl-color-text--black"></div>' +
  '</div>' +
  '</div>' +
  '<span class="star">' +
  '<div class="not-starred material-icons">star_border</div>' +
  '<div class="starred material-icons">star</div>' +
  '<div class="star-count">0</div>' +
  '</span>' +
  '<div class="text"></div>' +
  '<div class="comments-container"></div>' +
  '<form class="add-comment" action="#">' +
  '<div class="mdl-textfield mdl-js-textfield">' +
  '<input class="mdl-textfield__input new-comment" type="text">' +
  '<label class="mdl-textfield__label">Comment...</label>' +
  '</div>' +
  '</form>' +
  '</div>' +
  '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;
  if (componentHandler) {
    componentHandler.upgradeElements(postElement.getElementsByClassName('mdl-textfield')[0]);
  }

  var addCommentForm = postElement.getElementsByClassName('add-comment')[0];
  var commentInput = postElement.getElementsByClassName('new-comment')[0];
  var star = postElement.getElementsByClassName('starred')[0];
  var unStar = postElement.getElementsByClassName('not-starred')[0];

  // Set values.
  postElement.getElementsByClassName('text')[0].innerText = text;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
  postElement.getElementsByClassName('username')[0].innerText = author || 'Anonymous';
  postElement.getElementsByClassName('avatar')[0].style.backgroundImage = 'url("' +
  (authorPic || './silhouette.jpg') + '")';

  // Listen for comments.
  // [START child_event_listener_recycler]
  var commentsRef = firebase.database().ref('post-comments/' + postId);
  commentsRef.on('child_added', function(data) {
    addCommentElement(postElement, data.key, data.val().text, data.val().author);
  });

  commentsRef.on('child_changed', function(data) {
    setCommentValues(postElement, data.key, data.val().text, data.val().author);
  });

  commentsRef.on('child_removed', function(data) {
    deleteComment(postElement, data.key);
  });
  // [END child_event_listener_recycler]

  // Listen for likes counts.
  // [START post_value_event_listener]
  var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
  starCountRef.on('value', function(snapshot) {
    updateStarCount(postElement, snapshot.val());
  });
  // [END post_value_event_listener]

  // Listen for the starred status.
  var starredStatusRef = firebase.database().ref('posts/' + postId + '/stars/' + uid)
  starredStatusRef.on('value', function(snapshot) {
    updateStarredByCurrentUser(postElement, snapshot.val());
  });

  // Keep track of all Firebase reference on which we are listening.
  listeningFirebaseRefs.push(commentsRef);
  listeningFirebaseRefs.push(starCountRef);
  listeningFirebaseRefs.push(starredStatusRef);

  // Create new comment.
  addCommentForm.onsubmit = function(e) {
    e.preventDefault();
    createNewComment(postId, firebase.auth().currentUser.displayName, uid, commentInput.value);
    commentInput.value = '';
    commentInput.parentElement.MaterialTextfield.boundUpdateClassesHandler();
  };

  // Bind starring action.
  var onStarClicked = function() {
    var globalPostRef = firebase.database().ref('/posts/' + postId);
    var userPostRef = firebase.database().ref('/user-posts/' + authorId + '/' + postId);
    toggleStar(globalPostRef, uid);
    toggleStar(userPostRef, uid);
  };
  unStar.onclick = onStarClicked;
  star.onclick = onStarClicked;

  return postElement;
}

/**
 * Writes a new comment for the given post.
 */
 function createNewComment(postId, username, uid, text) {
  firebase.database().ref('post-comments/' + postId).push({
    text: text,
    author: username,
    uid: uid
  });
}

/**
 * Updates the starred status of the post.
 */
 function updateStarredByCurrentUser(postElement, starred) {
  if (starred) {
    postElement.getElementsByClassName('starred')[0].style.display = 'inline-block';
    postElement.getElementsByClassName('not-starred')[0].style.display = 'none';
  } else {
    postElement.getElementsByClassName('starred')[0].style.display = 'none';
    postElement.getElementsByClassName('not-starred')[0].style.display = 'inline-block';
  }
}

/**
 * Updates the number of stars displayed for a post.
 */
 function updateStarCount(postElement, nbStart) {
  postElement.getElementsByClassName('star-count')[0].innerText = nbStart;
}

/**
 * Creates a comment element and adds it to the given postElement.
 */
 function addCommentElement(postElement, id, text, author) {
  var comment = document.createElement('div');
  comment.classList.add('comment-' + id);
  comment.innerHTML = '<span class="username"></span><span class="comment"></span>';
  comment.getElementsByClassName('comment')[0].innerText = text;
  comment.getElementsByClassName('username')[0].innerText = author || 'Anonymous';

  var commentsContainer = postElement.getElementsByClassName('comments-container')[0];
  commentsContainer.appendChild(comment);
}

/**
 * Sets the comment's values in the given postElement.
 */
 function setCommentValues(postElement, id, text, author) {
  var comment = postElement.getElementsByClassName('comment-' + id)[0];
  comment.getElementsByClassName('comment')[0].innerText = text;
  comment.getElementsByClassName('fp-username')[0].innerText = author;
}

/**
 * Deletes the comment of the given ID in the given postElement.
 */
 function deleteComment(postElement, id) {
  var comment = postElement.getElementsByClassName('comment-' + id)[0];
  comment.parentElement.removeChild(comment);
}
function initFood() {
  var foodRef = firebase.database().ref('foods');

  foodRef.on('child_added', function(data) {
    console.log("Food: " + data.key);
    console.log("Image: " + data.val().image);

    foodImageMap.set(data.key, data.val().image);
  });

}

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

/**
 * Starts listening for new posts and populates posts lists.
 */
 function startDatabaseQueries() {
  // [START my_top_posts_query]
  var myUserId = firebase.auth().currentUser.uid;

  //khlee
  var today = new Date();

  console.log("getFullYear: " + today.getFullYear());
  console.log("getMonth: " + pad(today.getMonth() + 1));
  console.log("getDate: " + pad(today.getDate()));
  today = today.getFullYear() + "" + pad(today.getMonth() + 1) + pad(today.getDate());
  console.log("today: " + today);

  //var cateteriaNumber = "1식당";
  var lunchPostsRef = firebase.database().ref('menu/' + today + "/" + cateteriaNumber);
  console.log("Ref: " + lunchPostsRef);

  var fetchMenus = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      console.log("Data: " + data.key + ", " + data.val().menu + ", " + data.val().description);
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createMenuElement(data.key, data.val().menu, data.val().description),
        containerElement.firstChild);
    });
    postsRef.on('child_changed', function(data) { 
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
      postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
      postElement.getElementsByClassName('username')[0].innerText = data.val().author;
      postElement.getElementsByClassName('text')[0].innerText = data.val().body;
      postElement.getElementsByClassName('star-count')[0].innerText = data.val().starCount;
    });
    postsRef.on('child_removed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var post = containerElement.getElementsByClassName('post-' + data.key)[0];
      post.parentElement.removeChild(post);
    });
  };

  var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
  // [END my_top_posts_query]
  // [START recent_posts_query]
  var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  // [END recent_posts_query]
  var userPostsRef = firebase.database().ref('user-posts/' + myUserId);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var author = data.val().author || 'Anonymous';
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic),
        containerElement.firstChild);
    });
    postsRef.on('child_changed', function(data) { 
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
      postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
      postElement.getElementsByClassName('username')[0].innerText = data.val().author;
      postElement.getElementsByClassName('text')[0].innerText = data.val().body;
      postElement.getElementsByClassName('star-count')[0].innerText = data.val().starCount;
    });
    postsRef.on('child_removed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var post = containerElement.getElementsByClassName('post-' + data.key)[0];
      post.parentElement.removeChild(post);
    });
  };


  // Fetching and displaying all posts of each sections.
  fetchMenus(lunchPostsRef, lunchPostsSection); //khlee
  fetchPosts(topUserPostsRef, topUserPostsSection);
  fetchPosts(recentPostsRef, recentPostsSection);
  fetchPosts(userPostsRef, userPostsSection);

  // Keep track of all Firebase refs we are listening to.
  listeningFirebaseRefs.push(topUserPostsRef);
  listeningFirebaseRefs.push(recentPostsRef);
  listeningFirebaseRefs.push(userPostsRef);
}

/**
 * Writes the user's data to the database.
 */
// [START basic_write]
function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
// [END basic_write]

/**
 * Cleanups the UI and removes all Firebase listeners.
 */
 function cleanupUi() {
  //khlee - for debug
  recentMenuButton.style.visibility='hidden';
  myPostsMenuButton.style.visibility='hidden';
  myTopPostsMenuButton.style.visibility='hidden';

  // Remove all previously displayed posts.
  lunchPostsSection.getElementsByClassName('posts-container')[0].innerHTML = ''; //khlee
  topUserPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';
  recentPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';
  userPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';

  // Stop all currently listening Firebase listeners.
  listeningFirebaseRefs.forEach(function(ref) {
    ref.off();
  });
  listeningFirebaseRefs = [];
}

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
 var currentUID;

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
 function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  cleanupUi();
  if (user) {
    currentUID = user.uid;
    splashPage.style.display = 'none';
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    initFood();
    startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
    // Display the splash page where you can sign-in.
    splashPage.style.display = '';
  }
}

/**
 * Creates a new post for the current user.
 */
 function newPostForCurrentUser(title, text) {
  // [START single_value_read]  
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    //khlee
    //var username = snapshot.val().username;
    var username;
    if (firebase.auth().currentUser.isAnonymous) {
      console.log("User is anonymous.");
      username = "Guest";
    }
    else {
      username = snapshot.val().username;
    }
    // [START_EXCLUDE]
    return writeNewPost(firebase.auth().currentUser.uid, username,
      firebase.auth().currentUser.photoURL,
      title, text);
    // [END_EXCLUDE]
  });
  // [END single_value_read]
}

/**
 * Displays the given section element and changes styling of the given button.
 */
 function showSection(sectionElement, buttonElement) {
  lunchPostsSection.style.display = 'none'; //khlee
  recentPostsSection.style.display = 'none';
  userPostsSection.style.display = 'none';
  topUserPostsSection.style.display = 'none';
  addPost.style.display = 'none';
  lunchMenuButton.classList.remove('is-active'); //khlee
  recentMenuButton.classList.remove('is-active');
  myPostsMenuButton.classList.remove('is-active');
  myTopPostsMenuButton.classList.remove('is-active');

  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
  if (buttonElement) {
    buttonElement.classList.add('is-active');
  }
}

// Bindings on load.
window.addEventListener('load', function() {
  // Bind Sign in button.
  signInButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });
  
  // Bind Sign in button.
  signInGuestButton.addEventListener('click', function() {
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("errorCode: " + errorCode);
      console.log("errorMessage: " + errorMessage);
    });
  });
  
  // Bind Sign out button.
  signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  // Saves message on form submit.
  messageForm.onsubmit = function(e) {
    e.preventDefault();
    var text = messageInput.value;
    var title = titleInput.value;
    if (text && title) {
      newPostForCurrentUser(title, text).then(function() {
        myPostsMenuButton.click();
      });
      messageInput.value = '';
      titleInput.value = '';
    }
  };

  // Bind menu buttons.
  lunchMenuButton.onclick = function() { //khlee
    showSection(lunchPostsSection, lunchMenuButton);
  };
  recentMenuButton.onclick = function() {
    showSection(recentPostsSection, recentMenuButton);
  };
  myPostsMenuButton.onclick = function() {
    showSection(userPostsSection, myPostsMenuButton);
  };
  myTopPostsMenuButton.onclick = function() {
    showSection(topUserPostsSection, myTopPostsMenuButton);
  };

  myTopPostsMenuButton.onclick = function() {
    showSection(topUserPostsSection, myTopPostsMenuButton);
  };

  menuCafe2.onclick = function() {
    cateteriaNumber = "2식당";
    document.getElementsByClassName('text-cafe')[0].innerText = "2식당";
    console.log("2식당");
    cleanupUi();
    startDatabaseQueries();

  };
  menuCafe1.onclick = function() {
    cateteriaNumber = "1식당";
    document.getElementsByClassName('text-cafe')[0].innerText = "1식당";
    console.log("1식당");
    cleanupUi();
    startDatabaseQueries();
  };
  /*
  addButton.onclick = function() {
    showSection(addPost);
    messageInput.value = '';
    titleInput.value = '';
  };
  */
  //recentMenuButton.onclick();
  lunchMenuButton.onclick(); //khlee
}, false);