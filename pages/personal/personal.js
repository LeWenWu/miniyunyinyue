import request from "../../utils/request";

let startY = 0; // 手指起始的坐标
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(0)",
    coveTransition: "",
    userInfo: {}, // 用户信息
    recentPlayList: [], // 最近播放歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo),
      });
      this.getRecentPlayList(this.data.userInfo.userId);
    }
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

  // 滑动下拉触发处理
  handleTouchStart(event) {
    this.setData({
      coveTransition: "",
    });
    startY = event.touches[0].clientY;
  },
  // 滑动下拉过程处理
  handleTouchMove(event) {
    let moveY = event.touches[0].clientY;
    let moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
    });
  },
  // 滑动下拉结束处理
  handleTouchEnd() {
    this.setData({
      coverTransform: "translateY(0)",
      coveTransition: "transform 1s linear",
    });
  },

  // 去登陆页面
  toLogin() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },
  // 获取最近播放记录
  async getRecentPlayList(userId) {
    let recentPlayListData = await request("/user/record", {
      uid: userId,
      type: 0,
    });
    let recentPlayList = recentPlayListData.allData
      .splice(0, 10)
      .map((item, index) => {
        item.id = index + 1;
        return item;
      });
    this.setData({
      recentPlayList,
    });
  },
});
