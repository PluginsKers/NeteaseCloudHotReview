<?php

/**
 * 
 * NeteaseCloudHotReview
 * @author PluginsKers
 * @version 1.2.0
 * @url https://netease.52craft.cc/
 * @github https://github.com/PluginsKers/NeteaseCloudHotReview
 * 
 * 
 */
?>
<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
	<meta http-equiv="Expires" content="0">
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="Cache-control" content="no-cache">
	<meta http-equiv="Cache" content="no-cache">
	<link rel="stylesheet" type="text/css" href="./assets/css/swiper.min.css">
	<link rel="stylesheet" type="text/css" href="./assets/css/style.css">
	<script type="text/javascript" src="./assets/js/jquery-3.4.1.min.js"></script>
	<script type="text/javascript" src="./assets/js/jquery.cookie.js"></script>
	<script type="text/javascript" src="./assets/js/swiper.min.js"></script>
	<title>网易云热评墙</title>
</head>

<body>
	<div class="background">
		<div class="cover"></div>
	</div>
	<div id="neteaseReview" class="swiper-container background-review">
		<div class="wrapper">
		</div>
	</div>
	<div class="netease-outbox">
		<div class="player-bar"></div>
		<input id="bar" type="range" min="0">
		<img class="netease-pic" src="./assets/img/background.png" />
		<div class="netease-btn" onclick="playerControl()">
			<img id="player" src="./assets/img/play.png" style="width:24px;">
			<audio id="player" status="pause" autoplay></audio>
		</div>
		<div class="netease-player">
			<div class="netease-name">歌曲名称</div>
			<div class="netease-artist">艺术家</div>
		</div>
	</div>

	<script type="text/javascript" src="./assets/js/app.js"></script>
</body>

</html>