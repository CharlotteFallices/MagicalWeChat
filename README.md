# MagicalWechat

## Feature

- Prevent recall
- Dark, blurry and pink theme
- Login to multiple accounts

## Usage

1. Unzip `./WeChat.app/Contents/MacOS/WeChat.gz`
2. Move `./WeChat.app` to `/Application/WeChat.app`
3. Re-sign the app if it can't be opened:
```shell
swift -O Resign.swift
```

## Todo
- Fix a [bug](https://xlab.tencent.com/cn/2018/10/23/weixin-cheater-risks/) may lead to privacy leakage :(
