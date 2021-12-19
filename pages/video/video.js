// pages/video/video.js
import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navList: [], // 导航栏列表
    curNavId: "", // 当前选中的导航
    videoList: [], // 视频列表
    curVideoId: "", // 当前播放的视频id
    videoUpdateTime: [], // 记录video播放的时长
    isTriggered: false, // 是否触发下拉刷新的标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoNavList();
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

  // 获取导航数据
  async getVideoNavList() {
    let videoNavData = await request("/video/group/list");

    this.setData({
      navList: videoNavData.data.slice(0, 14),
      curNavId: videoNavData.data[0].id,
    });

    this.getVideoList(this.data.curNavId);
  },

  // 切换导航栏选项
  changeNav(event) {
    this.setData({
      curNavId: event.currentTarget.dataset.id,
    });
    this.getVideoList(this.data.curNavId);
  },
  // 查询视频数据
  async getVideoList(navId) {
    let userInfo = wx.getStorageSync("userInfo");
    // 视频接口需要登录后才能查询
    if (!userInfo || !navId) {
      this.setData({
        isTriggered: false,
      });
      return;
    }
    let videoListData = await request("/video/group", { id: navId });

    let videoList = videoListData.datas.map((item, index) => {
      item.id = index + 1;
      return item;
    });
    this.setData({
      videoList,
      isTriggered: false, // 关闭下拉刷新
    });
  },

  // 播放视频
  handlePlay(event) {
    this.setData({
      curVideoId: event.currentTarget.dataset.id,
    });

    this.getVideoUrl(this.data.curVideoId);

    let videoContext = wx.createVideoContext(this.data.curVideoId);
    let updateItem = this.data.videoUpdateTime.find((item) => {
      return item.vid === event.currentTarget.dataset.id;
    });
    if (updateItem) {
      videoContext.seek(updateItem.currentTime);
    }
    videoContext.play();
  },

  // 视频播放中时间更新
  handleTimeUpdate(event) {
    let videoTimeObj = {
      vid: event.currentTarget.dataset.id,
      currentTime: event.detail.currentTime,
    };
    let { videoUpdateTime } = this.data;
    let updateItem = videoUpdateTime.find((item) => {
      return item.vid === event.currentTarget.dataset.id;
    });
    if (updateItem) {
      updateItem.currentTime = event.detail.currentTime;
    } else {
      videoUpdateTime.push(videoTimeObj);
    }
    this.setData({
      videoUpdateTime,
    });
  },

  // 视频播放结束
  handleEnded(event) {
    let { videoUpdateTime } = this.data;
    videoUpdateTime = videoUpdateTime.filter((item) => {
      return item.vid !== event.currentTarget.dataset.id;
    });
    this.setData({
      videoUpdateTime,
    });
  },
  // 拉到底部触发，获取下一页数据
  handleToLower() {
    console.info("获取下一页数据");
  },
  // 下拉刷新数据
  handleRefresher() {
    this.getVideoList(this.data.curNavId);
  },

  async getVideoUrl(vid) {
    let videoUrData = await request("/video/url", { id: vid });
    let urlInfo = videoUrData.urls[0].url;
    let { videoList } = this.data;
    let curVideoItem = videoList.find((item) => {
      return item.data.vid === vid;
    });
    curVideoItem.videoUrl = urlInfo;
    this.setData({ videoList });
  },
});
