import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图列表
    recommendList: [], // 推荐歌曲列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBannerList();
    this.getRecommendList();
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

  // 查询轮播图数据
  async getBannerList() {
    let bannerData = await request("banner", { type: 2 });
    this.setData({
      bannerList: bannerData.banners,
    });
  },
  // 查询推荐列表
  async getRecommendList() {
    let recommendData = await request("personalized", { limit: 10 });
    this.setData({
      recommendList: recommendData.result,
    });
  },
  // 导航栏点击跳转到对应类型的页面
  toPageByType(event) {
    let type = event.currentTarget.dataset.type;
    let pageData = {
      recommend: "/pages/recommendSong/recommendSong",
    };
    wx.navigateTo({
      url: pageData[type],
    });
  },
});
