// 本地使用不需要修改。需要跨设备同步时，先运行 supabase.sql，再填这两项。
// 只能填写 Publishable / anon PUBLIC key，绝对不要填 secret / service_role key。
window.TRIP_CONFIG = {
  url: '',
  key: ''
};
// 不要在此填写空间密钥。配置云端后首次打开会在网址 #room= 后生成。
// 直接复制浏览器完整网址发给对方即可进入同一份计划；持有网址的人可以编辑。
