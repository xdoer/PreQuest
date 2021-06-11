# PreQuest

一套模块化，可插拔的 JavaScript HTTP 请求解决方案。

[![npm](https://img.shields.io/npm/v/@prequest/core.svg)](https://www.npmjs.com/package/@prequest/core)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/@prequest/core.svg)](https://bundlephobia.com/result?p=@prequest/core)
[![NPM Downloads](https://img.shields.io/npm/dm/@prequest/core.svg?style=flat)](https://www.npmjs.com/package/@prequest/core)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/a12940471bc144fdb4d0236e02610b6d)](https://www.codacy.com/gh/xdoer/PreQuest/dashboard?utm_source=github.com&utm_medium=referral&utm_content=xdoer/PreQuest&utm_campaign=Badge_Grade)
[![GitHub license](https://img.shields.io/github/license/xdoer/PreQuest)](https://github.com/xdoer/PreQuest/blob/main/LICENSE)

## 简介

PreQuest 是一款模块化、可插拔的 JavaScript HTTP 请求解决方案。

它采用了请求内核与上层封装相分离的模式，针对不同的 JS 环境，提供了一致的中间件、拦截器、全局配置等功能的体验，并且可以通过注册中间件的方式，为你的 HTTP 请求添加接口缓存、错误重试等功能。

此外，本项目中还针对一些常见的需求，给出了相应的解决方案，比如 Token 校验、React 中的 Request Hook 等等。

仓库中已经提供了针对不同平台封装好的请求库，你可以直接使用。或者你有一些特殊需求，你甚至可以基于本项目，做请求库的二次封装。

## 异同

PreQuest 与 axios、umi-request 的区别在于，PreQuest 并不是一个请求库，而是一套解决方案。

对于库的开发者来说，你可以很容易的基于本项目，快速封装一个类似 axios 的请求库。

对于业务用户来说，如果你的项目使用的是自己封装的原始 Http 请求, 那么你可以通过 [@prequest/wrapper](https://github.com/xdoer/PreQuest/tree/main/packages/wrapper) 很容易的迁移到 PreQuest 中；如果你使用的是 axios、umi-request 这类请求库，那么你可能会使用 [@prequest/lock](https://github.com/xdoer/PreQuest/tree/main/packages/lock) 进行无痛刷新 token 等；如果你新建了一个项目，你可以集成 [@prequest/xhr](https://github.com/xdoer/PreQuest/tree/main/packages/xhr) 等几个直接封装好的请求库。

## 灵感

在写小程序的时候，发现并没有一个好用的类似 axios 的请求库，想基于 axios 封装一个小程序端用的请求库。在阅读 axios 和 umi-request 源码后发现，请求内核和上层架构其实完全可以分离开，axios 与 umi-request 等库可能基于品牌推广等缘由，将 web 端和 node 端的请求库杂糅到了一份代码里，导致请求参数冗余，且不好扩展，因而自己封装了 PreQuest，它采用 TypeScript 语法，用户可以针对不同的平台，基于自己的业务，快速封装一套高定制的请求库。
