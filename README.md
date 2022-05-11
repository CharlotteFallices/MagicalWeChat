# MagicalWechat

## Feature

- Prevent recall
- Dark, blurry and pink theme
- Login to multiple accounts

## Usage

1. Unzip `./WeChat.app/Contents/MacOS/WeChat.gz`
2. Re-sign the app if it can't be opened:
```shell
codesign --sign - --force --deep ./WeChat.app
```

## Todo
- Fix a [bug](https://xlab.tencent.com/cn/2018/10/23/weixin-cheater-risks/) may lead to privacy leakage :(
