const fadeIn = 100;
const stay = 700;
const fadeOut = 200;

const blacklist = [
	"www.youtube.com",
];

// chrome.storage.local.get(["profile"], function(result) {
// 	let profile = {
// 		disabledPages: blacklist,
// 	};
// 	if (!$.isEmptyObject(result)) {
// 		profile = result["profile"];
// 	}
// 	const domain = getDomain(document.location.href);
// 	if (!profile.disabledPages.some(s => s === domain)) {
// 		maybeInit();
// 	}
// });

/**
 * @type {HTMLVideoElement}
 */
let focusedVideo;

let speed = 3;

const speedMap = [
	0.25,
	0.5,
	0.75,
	1,
	1.25,
	1.5,
	1.75,
	2,
	2.5,
	3,
	3.5,
	4
];

const toast = document.createElement("nitro-speed");
let interv;
let anim;
let doFadeIn = true;

function displaySpeed() {
	if (interv) {
		clearInterval(interv);
		anim.cancel();
	}

	toast.textContent = speedMap[speed] + "x";
	const parent = document.fullscreenElement ?? focusedVideo.parentElement;
	//console.log(parent);

	parent.appendChild(toast);

	anim = toast.animate([
		{ opacity: "1" }
	], {
		duration: doFadeIn ? fadeIn : 0,
		easing: "ease",
		fill: "forwards"
	});
	doFadeIn = false;
	interv = setTimeout(() => {
		doFadeIn = true;
		toast.animate([
			{ opacity: "0" }
		], {
			duration: fadeOut,
			easing: "ease",
			fill: "forwards"
		});
	}, fadeIn + stay);
}

function adjustSpeed(change) {
	speed += change;
	if (speed < 0 || speed >= speedMap.length) {
		speed -= change;
	}

	focusedVideo.playbackRate = speedMap[speed];
	displaySpeed();
}

window.addEventListener("keydown", (ev) => {
	if (focusedVideo && ev.shiftKey && !(ev.target instanceof HTMLInputElement)) {
		if (ev.key === ":") adjustSpeed(1);
		else if (ev.key === ";") adjustSpeed(-1);
	}
});

// Fix the entire document as soon as possible
$(function() {
	const domain = getDomain(document.location.href);
	if (!blacklist.some(s => s === domain)) {
		// Website is not blacklisted
		let video;
		setInterval(() => {
			video = $("video[src]");
			if (video.length > 0) {
				if (video[0] != focusedVideo) {
					focusedVideo = video[0];
					chrome.runtime.sendMessage({ action: "enable" });
					//console.log("Attached speed control!");
				}
			} else {
				focusedVideo = null;
			}
		}, 1000);
	}
});

// chrome.runtime.onMessage.addListener(function(request, sender) {
// 	if (!sender.tab) {
// 		if (request.action === "apply_changes") {
// 			maybeInit();
// 		}
// 	}
// });

/**
 * @param {String} url 
 */
function getDomain(url) {
	url = url.substr(url.indexOf("//") + 2);
	url = url.substr(0, url.indexOf("/"));
	return url;
}