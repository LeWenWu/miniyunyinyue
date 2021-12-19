import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recommendList: [],
    newSong: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommendList();
    this.getNewRecommend();
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

  // 获取用户每日推荐数据
  async getRecommendList() {
    let recommendListData = await request("/recommend/songs");
    this.setData({
      recommendList: recommendListData.data.dailySongs,
    });
    // 把每日推荐的数据缓存起来
    wx.setStorageSync(
      "recommendList",
      JSON.stringify(recommendListData.data.dailySongs)
    );
  },
  async getNewRecommend() {
    let newSongData = await request("/album/list", { limit: 1 });

    console.log("newSongData", newSongData);
    this.setData({
      newSong: newSongData.products[0],
    });
  },
  // 去详情页进行播放
  toSongDetail(event) {
    let { song } = event.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/songDetail/songDetail?musicId=" + song.id,
    });
  },
});
