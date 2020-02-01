/**
 * 
 * NeteaseCloudHotReview
 * @author PluginsKers
 * @version 1.1.0
 * @url https://netease.52craft.cc/
 * @github https://github.com/PluginsKers/NeteaseCloudHotReview
 * 
 * 
 */

/**
 * API of NeteaseCloudMusicApi
 */
var API = "http://www.china-4s.com";

/**
 * Config of APP
 */
var playList = _get_('l'); // 歌单ID
var onceLoad = 10; // 一次加载多少
var player = $("audio#player");
var playerBar = $(".player-bar").eq(0);
var playerId; // 全局ID
var NeteaseReview = new Swiper("div#neteaseReview", {
    wrapperClass: "wrapper",
    slideClass: "silde",
    slideActiveClass: "active",
    slideNextClass: "next",
    slidePrevClass: "prev",
    noSwipingClass: 'no-swiping',
    direction: "horizontal",
    width: window.innerWidth,
    noSwiping: true,
    keyboard: true,
    mousewheel: false,
    speed: 200,
    on: {
        slideChangeTransitionStart: function() {
            _overlay_('show');
            player[0].pause();
        },
        slideChangeTransitionEnd: function() {

            if (NeteaseReview.isEnd) {
                detailLoader(playList, onceLoad, NeteaseReview.slides.length - 1);
            }

            slide = NeteaseReview.slides[NeteaseReview.activeIndex];
            id = slide.getAttribute('music-id');
            playerId = id; // 同步全局id
            playerLoader(id);
            commentLoader(id);
            $("div.cover").eq(0).css("background-color", _color_());
            _overlay_('hidden');
        },
        slidePrevTransitionStart: function() {
            $.cookie('play', parseInt($.cookie('play')) - 1, { expires: 1 });
        },
        slideNextTransitionStart: function() {
            $.cookie('play', parseInt($.cookie('play')) + 1, { expires: 1 });
        },
    },
});

$(function() {
    if (playList) {

    } else {
        NeteaseReview.appendSlide('<div class="silde" music-id="1306507078"><h1 id="comment" class="title-h1 title-style">无法获得歌单信息</h1><h3 id="author" class="title-h3 title-style">请传入歌单ID</h3></div>');
        return false;
    }

    NeteaseReview.appendSlide('<div class="silde" music-id="1306507078"><h1 id="comment" class="title-h1 title-style">网易云热评墙(双击评论可刷新)</h1><h3 id="author" class="title-h3 title-style">向左滑动开始你的旅程</h3></div>');

    cList = $.cookie('list');
    cPlay = $.cookie('play');
    if (cPlay && cPlay > 0 && cList && cList == playList) {
        $("h3#author").text('已为你跳转到上次关闭时的进度');
        $.cookie('play', parseInt(cPlay) - 1, { expires: 1 }); // 去重
        detailLoader(playList, onceLoad, cPlay);
    } else {
        $.cookie('list', playList, { expires: 1 });
        $.cookie('play', '0', { expires: 1 });
        detailLoader(playList, onceLoad);
    }

    detailLoader(playList, onceLoad);
    $("div.cover").eq(0).css("background-color", _color_());
    /**
     * Event Listeners
     */
    player.on('ended', function() {
        NeteaseReview.slideNext();
    });
    $("h1#comment").dblclick(function() {
        commentLoader(playerId);
    });
});

function commentLoader(id) {
    data = ajaxRequest('/comment/hot', 'type=0&id=' + id);
    comment = data['hotComments'][Math.floor(Math.random() * data['hotComments'].length)];
    slide = $("div[music-id='" + id + "']");
    slide.find($("h1#comment")).text(comment['content']);
    slide.find($("h3#author")).text(comment['user']['nickname']);
}

function playerControl(c) {
    a = $("img#player");
    switch (c) {
        case 'play':
            a.attr('src', './assets/img/pause.png');
            player.attr('status', 'play');
            player[0].play();
            break;

        case 'pause':
            a.attr('src', './assets/img/play.png');
            player.attr('status', 'pause');
            player[0].pause();
            break;

        default:
            if (player.attr('status') == 'play') {
                a.attr('src', './assets/img/play.png');
                player.attr('status', 'pause');
                player[0].play();
            } else {
                a.attr('src', './assets/img/pause.png');
                player.attr('status', 'play');
                player[0].pause();
            }
            break;
    }
}

function playerLoader(ids) {
    data = ajaxRequest('/song/detail', 'ids=' + ids);
    music = ajaxRequest('/song/url', 'id=' + ids);
    song = data['songs'][0];
    for (i = 0; i < song['ar'].length; i++) {
        artist = song['ar'][i]['name'];
    }
    $(".netease-pic").eq(0).attr('src', song['al']['picUrl']);
    $(".netease-name").eq(0).text(song['name']);
    $(".netease-artist").eq(0).text(artist);
    player.attr('src', music['data'][0]['url']);
    player[0].play();

    e = $("input#bar");
    e.attr('max', song['dt']);
    e.on('input', function() {
        player[0].currentTime = e.val() / 1000;
    });

    r = setInterval(function() {
        playerBar.css('width', (player[0].currentTime * 100000) / song['dt'] + "%");
    }, 100);
}

function detailLoader(id, m, b = 0) {
    _overlay_('show');
    data = ajaxRequest('/playlist/detail', 'id=' + id);
    $("title").text(data['playlist']['name']);
    c = 0
    for (e = b; e < data['playlist']['tracks'].length && c < m; e++) {
        tracks = data['playlist']['tracks'][e];
        name = tracks['name'];
        id = tracks['id'];
        NeteaseReview.appendSlide('<div class="silde" music-id="' + id + '"><h1 id="comment" class="title-h1 title-style"></h1><h3 id="author" class="title-h3 title-style"></h3></div>');
        c++;
    }
    _overlay_('hidden');
}

function ajaxRequest(url, data) {
    var result;
    $.ajax({
        url: API + url,
        data: data,
        async: false, // 关闭异步模式
        dataType: 'json',
        success: function(json) {
            result = json;
        },
        error: function() {
            result = undefined;
        }
    });
    return result;
}

function _overlay_(s) {
    switch (s) {
        case 'show':
            NeteaseReview.keyboard.disable();
            $("body").append('<div class="_overlay_"><div class="spinner-box"><div class="solar-system"><div class="earth-orbit orbit"><div class="planet earth"></div><div class="venus-orbit orbit"><div class="planet venus"></div><div class="mercury-orbit orbit"><div class="planet mercury"></div><div class="sun"></div></div></div></div></div></div></div>');
            break;

        case 'hidden':
            NeteaseReview.keyboard.enable();
            if ($("._overlay_").length > 0) {
                $("._overlay_").eq(0).remove();
            }
            break;

        default:
            console.log("No Command");
            break;
    }
}

function _color_() {
    this.r = Math.floor(Math.random() * 255);
    this.g = Math.floor(Math.random() * 255);
    this.b = Math.floor(Math.random() * 255);
    return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', 1)';
}

function _get_(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}