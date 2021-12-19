import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "", // 手机号码
    password: "", // 密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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

  // 输入处理
  handleInput(event) {
    let type = event.currentTarget.dataset.type;
    this.setData({
      [type]: event.detail.value,
    });
  },

  async login() {
    let { phone, password } = this.data;
    if (!phone || !password) {
      wx.showToast({
        title: "手机号和密码不能为空",
        icon: "none",
      });
      return;
    }
    // 定义正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: "手机号格式错误",
        icon: "none",
      });
      return;
    }
    let result = await request("/login/cellphone", {
      phone,
      password,
      isLogin: true,
    });
    if (result.code === 200) {
      wx.showToast({
        title: "登录成功",
      });
      // 将用户的信息存储至本地
      wx.setStorageSync("userInfo", JSON.stringify(result.profile));
      wx.reLaunch({
        url: "/pages/personal/personal",
      });
    } else {
      let errMsg = { 400: "手机号错误", 502: "密码错误" };
      let title =
        result.code && errMsg[result.code.toString()]
          ? errMsg[result.code.toString()]
          : "登录失败";
      wx.showToast({
        title,
        icon: "none",
      });
    }
  },
});
