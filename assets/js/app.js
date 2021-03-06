/**
 * 
 * NeteaseCloudHotReview
 * @author PluginsKers
 * @version 1.4.0
 * @url https://netease.52craft.cc/
 * @github https://github.com/PluginsKers/NeteaseCloudHotReview
 * 
 * 
 */

/**
 * API
 */
var API = "http://www.china-4s.com";

/**
 * 初始化
 */
var playList = _get_('l'), // 歌单ID
    onceLoad = 3, // 一次加载多少
    player = $("audio#player"),
    playerBar = $(".player-bar").eq(0),
    playerId, // 全局ID
    cacheDataPlaylist,
    cacheDataComments;
/**
 * Swiper实例创建
 */
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
    on: {
        /**
         * 滑动变化开始监听
         */
        slideChangeTransitionStart: function() {
            playerControl('pause');
        },
        /**
         * 滑动变化结束监听
         */
        slideChangeTransitionEnd: function() {
            slide = NeteaseReview.slides[NeteaseReview.activeIndex];
            id = slide.getAttribute('music-id');
            playerId = id; // 同步全局id

            $.cookie('play', id, { expires: 1 }); // 记录当前歌曲ID
            $.cookie('record', '0', { expires: 1 }); // 初始化当前歌曲引索
            for (q = 0; q < cacheDataPlaylist['playlist']['tracks'].length; q++) {
                if (cacheDataPlaylist['playlist']['tracks'][q]['id'] == $.cookie('play')) {
                    $.cookie('record', q, { expires: 1 }); // 记录当前歌曲的引索
                    break;
                } else {
                    continue;
                }
            }

            playerLoader(id);
            $("div.cover").eq(0).css("background-color", _color_());
            _overlay_('hidden');
        },
        /**
         * Next滑动开始监听
         */
        slideNextTransitionStart: function() {
            _overlay_('show');
        },
        /**
         * Next滑动结束监听
         */
        slideNextTransitionEnd: function() {
            if (NeteaseReview.isEnd) {
                detailLoader(playList, onceLoad, parseInt($.cookie('record')) + 1);
            }

            cacheDataComments = null;

            slide = NeteaseReview.slides[NeteaseReview.activeIndex];
            id = slide.getAttribute('music-id');
            commentLoader(id);
        },
    },
});

$(function() {
    if (playList) {
        NeteaseReview.appendSlide('<div class="silde"><h1 id="comment" class="title-h1 title-style">网易云热评墙(双击评论可刷新)</h1><h3 id="author" class="title-h3 title-style">向左滑动开始你的旅程</h3></div>');

        // 断线重连
        cList = $.cookie('list');
        cPlay = $.cookie('play');
        cRecord = $.cookie('record');
        if (cPlay && cList && cRecord && cList == playList) {
            $("h3#author").text('已为你跳转到上次关闭时的进度');
            $.cookie('play', playerId, { expires: 1 });
            detailLoader(playList, onceLoad, cRecord);
        } else {
            $.cookie('list', playList, { expires: 1 });
            $.cookie('play', null);
            detailLoader(playList, onceLoad);
        }

        $("div.cover").eq(0).css("background-color", _color_());
        /**
         * 初始化事件监听
         */
        player.on('ended', function() {
            NeteaseReview.slideNext();
        });
    } else {
        NeteaseReview.appendSlide('<div class="silde"><h1 id="comment" class="title-h1 title-style">无法获得歌单信息</h1><h3 id="author" class="title-h3 title-style">请传入歌单ID</h3></div>');
        return false;
    }
});

function commentLoader(id) {
    if (cacheDataComments) {
        data = cacheDataComments;
    } else {
        data = ajaxRequest('/comment/hot', 'type=0&id=' + id);
        cacheDataComments = data;
    }

    slide = $("div[music-id='" + playerId + "']");

    for (c = 0; c < data['hotComments'].length; c++) {
        comment = data['hotComments'][Math.floor(Math.random() * data['hotComments'].length)];
        if (comment['content'] && comment['user']['nickname'] && slide.find($("h1#comment")).text() != comment['content']) {
            break;
        }
    }

    slide.find($("h1#comment")).text(comment['content']);
    slide.find($("h3#author")).text('来自 ' + comment['user']['nickname']);
}

function playerControl(c) {
    a = $("img#player");
    switch (c) {
        case 'play':
            a.attr('src', './assets/img/play.png');
            player.attr('status', 'play');
            player[0].play();
            break;

        case 'pause':
            a.attr('src', './assets/img/pause.png');
            player.attr('status', 'pause');
            player[0].pause();
            break;

        default:
            if (player.attr('status') == 'play') {
                a.attr('src', './assets/img/pause.png');
                player.attr('status', 'pause');
                player[0].pause();
            } else {
                a.attr('src', './assets/img/play.png');
                player.attr('status', 'play');
                player[0].play();
            }
            break;
    }
}

function playerLoader(ids) {
    for (r = 0; r < cacheDataPlaylist['playlist']['tracks'].length; r++) {
        if (cacheDataPlaylist['playlist']['tracks'][r]['id'] == playerId) {
            song = cacheDataPlaylist['playlist']['tracks'][r];
        }
    }

    for (i = 0; i < song['ar'].length; i++) {
        artist = song['ar'][i]['name'];
    }
    $(".netease-pic").eq(0).attr('src', song['al']['picUrl']);
    $(".netease-name").eq(0).text(song['name']);
    $(".netease-artist").eq(0).text(artist);

    $("title").text(song['name']);

    music = ajaxRequest('/song/url', 'id=' + ids);
    if (playerId && music['data'][0]) {
        player.attr('src', music['data'][0]['url']);
        playerControl('play');
    }

    /**
     * 进度条
     */
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
    $("h1.title-h1").unbind('dblclick'); // 删除现有的双击监听
    if (cacheDataPlaylist && cacheDataPlaylist['playlist']['id'] == $.cookie('list')) {
        data = cacheDataPlaylist;
    } else {
        data = ajaxRequest('/playlist/detail', 'id=' + id);
        cacheDataPlaylist = data;
    }

    $("title").text(data['playlist']['name']);
    c = 0
    for (e = b; e < data['playlist']['tracks'].length && c < m; e++) {
        tracks = data['playlist']['tracks'][e];
        name = tracks['name'];
        id = tracks['id'];
        NeteaseReview.appendSlide('<div class="silde" music-id="' + id + '""><h1 id="comment" class="title-h1 title-style">加载中...</h1><h3 id="author" class="title-h3 title-style" onclick="copyComment()">加载中...</h3></div>');
        c++;
    }
    /**
     * 双击监听事件
     */
    $("h1.title-h1:not(:eq(0))").dblclick(function() {
        console.log('dblclick');
        commentLoader(playerId);
    });
    _overlay_('hidden');
}

function copyComment() {
    console.log('copy');
    slide = $("div[music-id='" + playerId + "']");
    q = slide.find($("h1#comment")).text();
    w = slide.find($("h3#author")).text();
    e = $("#copyarea");
    e.val(q + "\r" + w);
    e.select();
    document.execCommand("Copy");
    e.val('');
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
            NeteaseReview.allowSlideNext = false;
            $("body").append('<div class="_overlay_"><div class="spinner-box"><div class="solar-system"><div class="earth-orbit orbit"><div class="planet earth"></div><div class="venus-orbit orbit"><div class="planet venus"></div><div class="mercury-orbit orbit"><div class="planet mercury"></div><div class="sun"></div></div></div></div></div></div></div>');
            break;

        case 'hidden':
            NeteaseReview.keyboard.enable();
            NeteaseReview.allowSlideNext = true;
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
    this.r = Math.floor(Math.random() * 250);
    this.g = Math.floor(Math.random() * 250);
    this.b = Math.floor(Math.random() * 200);
    return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', 1)';
}

function _get_(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}