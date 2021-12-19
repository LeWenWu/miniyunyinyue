import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    currentWidth: 0,
    curPlayTime: "00:00",
    durationTime: "00:00",
    curSongItem: {},
    allMusicLinkData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;
    this.getSongDetail(musicId);
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true,
      });
    });
    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false,
      });
    });
    this.backgroundAudioManager.onEnded(() => {
      this.setData({
        isPlay: false,
      });
      this.handleSwichSong(1);
    });
    this.backgroundAudioManager.onTimeUpdate(() => {
      let curPlayTime = this.formatTime(
        this.backgroundAudioManager.currentTime * 1000
      );
      let currentWidth =
        (this.backgroundAudioManager.currentTime /
          this.backgroundAudioManager.duration) *
        450;
      this.setData({
        curPlayTime,
        currentWidth,
      });
    });
    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false,
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  // 格式化时间
  formatTime(times) {
    let allSeconds = times / 1000;
    let min = Math.floor(allSeconds / 60);
    let second = Math.floor(allSeconds % 60);
    min = min > 9 ? min : `0${min}`;
    second = second > 9 ? second : `0${second}`;
    return `${min}:${second}`;
  },

  // 查询歌曲详情
  async getSongDetail(musicId) {
    let recommendListStr = wx.getStorageSync("recommendList");
    let recommendList = recommendListStr ? JSON.parse(recommendListStr) : [];

    let songItem = recommendList.find((recommendItem) => {
      return recommendItem.id === Number(musicId);
    });

    // if (!songItem) {
    //   let songData = await request("/song/detail", { ids: musicId });
    //   songItem = songData.songs[0];
    // }
    this.refreshCurPlaySong(songItem);
  },
  handleSwichSong(count) {
    let recommendListStr = wx.getStorageSync("recommendList");
    let recommendList = recommendListStr ? JSON.parse(recommendListStr) : [];
    let { curSongItem } = this.data;
    let curIndex = recommendList.findIndex((recommendItem) => {
      return recommendItem.id === curSongItem.id;
    });
    let newIndex = curIndex + count;
    if (newIndex > recommendList.length - 1) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = recommendList.length - 1;
    }
    let songItem = recommendList.find((item, index) => {
      return index === newIndex;
    });
    this.refreshCurPlaySong(songItem);
  },
  // 切换歌曲
  switchSong(event) {
    let { type } = event.currentTarget.dataset;
    let count = type === "pre" ? -1 : +1;
    this.handleSwichSong(count);
  },

  // 刷新当前播放的音乐
  refreshCurPlaySong(songItem) {
    let durationTime = this.formatTime(songItem.dt);
    this.setData({
      curSongItem: songItem,
      durationTime,
    });
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.curSongItem.name,
    });
    this.playControl(true, songItem.id);
  },

  // 播放处理
  handlePlay(event) {
    let isPlay = !this.data.isPlay;
    let { id } = this.data.curSongItem;
    this.playControl(isPlay, id);
  },

  // 播放控制
  async playControl(isPlay, musicId) {
    this.setData({
      isPlay,
    });
    if (!isPlay) {
      this.backgroundAudioManager.pause();
      return;
    }

    let { allMusicLinkData } = this.data;
    let musicLink = allMusicLinkData[musicId];
    if (!musicLink) {
      let musicLinkData = await request("/song/url", { id: musicId });
      musicLink = musicLinkData.data[0].url;
      allMusicLinkData[musicId] = musicLink;
      this.setData({
        allMusicLinkData,
      });
    }
    this.backgroundAudioManager.src = musicLink;
    this.backgroundAudioManager.title = this.data.curSongItem.name;
  },
});
