---
title: '[React] 1. Storybook으로 React Common UI 개발하기 - 소개 및 설치'
categories:
  - React
tags:
  - [react, cra, storybook, typescript, npm]
toc: true
toc_sticky: true
toc_label: 'React & Storybook'
date: 2023-08-22
last_modified_at: 2023-08-22
---

## Storybook 이란?

> Storybook: Frontend workshop for UI development
> (공식 문서 발췌)

[**스토리북은(Storybook)**](https://storybook.js.org/)은 비즈니스 로직과 맥락(context)으로부터 분리된 UI 컴포넌트를 구축할 수 있도록 도와주는 개발 도구입니다. 스토리북은 UI 컴포넌트를 문서화하고, 테스트하고, 디자인 시스템을 개발하기 위한 기본 플랫폼으로써 사용할 수 있습니다.

스토리북의 기본 구성 단위는 **스토리(Story)**이며 하나의 UI 컴포넌트는 하나 이상의 스토리를 가질 수 있습니다. 각 스토리는 UI 컴포넌트가 가질 수 있는 다양한 상태를 묘사합니다. 즉, UI 컴포넌트가 어떻게 사용될 수 있는지를 스토리를 통해 보여준다고 생각할 수 있습니다.

스토리북을 사용하지 않은 이전의 프로젝트에서는 UI 구성 요소의 렌더링을 확인하기 위해 먼저 전체 앱을 가동해야만 했습니다.

> _앱을 켜고, 테스트할 페이지로 이동하고, 새로고침을 반복하며 UI 상태 변화를 확인하고..._

또한 복잡하게 얽혀 있는 상태 및 앱 컨텍스트를 이해하며 디버깅하는 작업이 필요했습니다. 이는 엄청난 시간 낭비이며 골치 아픈 일입니다.

스토리북은 구성 요소를 렌더링하기 위한 격리된 iframe을 제공합니다. 이를 통해 모든 단계를 건너 뛰고 특정 상태의 UI 구성 요소를 눈으로 확인하고 테스트해 볼 수 있습니다.

## 실습 프로젝트 생성

### 개발 환경:

- **Windows 10**
- **Node 18.17.1**
- **npm 9.8.1**

[CRA(Create React App)](https://create-react-app.dev/)란 리액트 개발 환경을 쉽게 구축해주는 도구입니다. CRA를 사용해 프로젝트를 생성하면 보일러플레이트(boilerplate)라 불리는 기본 파일 구조가 생성되고, 여기에는 웹 사이트를 로컬로 실행하기 위한 개발 서버 등이 포함되어 있습니다. 그럼 [npx](https://docs.npmjs.com/cli/v8/commands/npx) 명령어를 사용해 프로젝트를 새로 하나 생성해 보겠습니다. 저는 타입스크립트(Typescript)를 사용하기 위해 `--template typescript` 명령어를 추가하였습니다(Option).

```console
npx create-react-app <프로젝트 디렉터리명> --template typescript
cd <프로젝트 디렉터리명>
```

> 참고: npx란 npm 레지스트리에 있는 패키지를 더 쉽게 설치하고 관리할 수 있도록 도와주는 CLI(Command-line interface) 도구입니다. 설치되어 있지 않다면 `npm install -g npx` 명령어를 통해 설치해 주세요.

## Storybook 설치

React 프로젝트가 설치되었다면 src 폴더와 package.json이 존재하는 루트 디렉터리로 이동해 주세요. 그 다음 Storybook CLI를 사용해서 Storybook을 프로젝트에 추가합니다.

```console
npx sb init
```

> 중간에 스토리북에 대한 **Eslint**를 사용할 것인지 질문이 나옵니다. **Eslint**를 사용하겠다면 Y를 눌러 설치해 주세요.

Story 설치까지 완료되면 터미널에서 자동으로 Storybook 앱이 실행되며 브라우저에서 아래 화면을 만나실 수 있습니다.

![Storybook init](/assets/images/React/Storybook%20init.PNG)

또한 2023.08.23 기준, 패키지에 설치된 버전은 아래와 같습니다.

```jsonc
"dependencies": {
  // ...생략
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-scripts": "5.0.1",
  "typescript": "^4.9.5"
},
"devDependencies": {
  "@storybook/addon-essentials": "^7.3.2",
  "@storybook/addon-interactions": "^7.3.2",
  "@storybook/addon-links": "^7.3.2",
  "@storybook/addon-onboarding": "^1.0.8",
  "@storybook/blocks": "^7.3.2",
  "@storybook/preset-create-react-app": "^7.3.2",
  "@storybook/react": "^7.3.2",
  "@storybook/react-webpack5": "^7.3.2",
  "@storybook/testing-library": "^0.2.0",
  "babel-plugin-named-exports-order": "^0.0.2",
  "eslint-plugin-storybook": "^0.6.13",
  "prop-types": "^15.8.1",
  "storybook": "^7.3.2",
  "webpack": "^5.88.2"
}
```

## 마치면서

지금까지 스토리북(Storybook)에 대한 간단한 소개와 설치 방법에 대해 알아보았습니다. 다음 장에서는 보편적으로 사용되는 UI 컴포넌트를 직접 만들어 보며 Story를 추가하는 방법에 대해 알아보겠습니다. 저는 React를 사용하여 개발을 진행하지만 스토리북은 Next.js, Vue, Angular 등 라이브러리와 프레임워크에 구애받지 않고 다양한 방식으로 개발하는 것을 지원합니다. 또한 Storybook에서 제공하는 [애드온(Add-on)](https://storybook.js.org/tutorials/intro-to-storybook/react/ko/using-addons/)을 통해 추가적인 기능도 활용 가능합니다. 여기까지 읽으셨다면, 스토리북 탐험을 떠날 준비는 완료되셨겠죠?
