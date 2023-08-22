---
title: '[React] 2. Storybook으로 React Common UI 개발하기 - Input 편'
categories:
  - React
tags:
  - [react, storybook, html, input, emotion, styled-component]
toc: true
toc_sticky: true
toc_label: 'React & Storybook'
date: 2023-08-23
last_modified_at: 2023-08-23
---

## Input Component

> [**input**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) element는 입력 유형과 속성의 조합이 매우 많기 때문에 모든 HTML 요소 중에서 가장 강력하고 복잡한 요소 중 하나입니다.<br>
> (MDN 발췌)

공식문서에서도 강조하듯 **input** 요소는 쓰임새가 정말 많습니다. 버튼부터 시작해서 체크박스, 라디오, 달력, 이메일 및 패스워드, 파일 업로드 등 대표적인 것만 해도 손가락으로 셀 수가 없네요.

input 컴포넌트는 기본적으로 사용자의 입력을 받기 위해 사용합니다. 그리고 입력받은 값으로 특정 동작(로그인 등)을 하는 것이 대부분이죠. 그래서 오늘은 범용성 있게 사용하는 input 컴포넌트를 직접 만들어보며 Story를 추가하는 방법에 대해서도 알아보도록 하겠습니다.

## Interface 정의

보통 **Props Interface**를 정의할 때 아래와 같이 작성하곤 합니다. 아래 코드는 [이전 장](https://dinggul2.github.io/react/React-Storybook-1/)에서 스토리북 설치를 완료했을 경우 기본적으로 들어있는 Button component의 인터페이스 입니다. 이전 장을 읽지 않으셨어도 이해하기엔 무방합니다.

```ts
interface ButtonProps {
  primary?: boolean
  backgroundColor?: string
  size?: 'small' | 'medium' | 'large'
  label: string
  onClick?: () => void
}
```

Input component의 Props도 마찬가지로 스타일 요소, 제어할 속성과 onClick 이벤트 핸들러 등을 인터페이스에 정의할 수 있습니다. 하지만 만약 Props로 제어해야 하는 속성이 많아진다면 어떻게 될까요?

```ts
/* 예시입니다 */
interface InputProps {
  // 스타일 요소
  color?: string
  backgroundColor?: string
  // 속성들
  name?: string
  type?: string
  disabled?: boolean
  placeholder?: string
  // 이벤트 핸들러
  onBlur()?: void
  onFocus()?: void
  onChange()?: void
  // More...
}
```

음... 제가 생각하기에 별로 좋은 방법은 아닌 것 같습니다. 정의해야 하는 속성이 너무 많고, 정의되지 않은 속성을 사용하기도 힘들어 보입니다. 또한 컴포넌트가 반환하는 태그에 원래 존재하던 속성을 오버라이딩 하는 경우 타입 오류가 발생할 수도 있습니다(오버라이딩이라는 표현이 맞는지 잘 모르겠습니다). 그래서, React에는 HTML 태그가 기본적으로 가지고 있던 속성(attribute)을 확장하여 인터페이스를 정의하는 방법이 존재합니다.

### React.HTMLAttributes

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // ...
}

const Input = (props: InputProps) => {
  return <input {...props} />
}
```

위 코드처럼 Input component를 만들어 준다면,

![Storybook-2-1](/assets/images/React/Storybook-2-1.png)

input 태그가 기본적으로 가지고 있던 속성들은 물론이고, 추가적으로 필요한 속성들을 인터페이스에 정의하여 사용할 수 있습니다.

> 자주 사용되는 'HTMLAttributes' 타입에는 'InputHTMLAttributes', 'TextareaHTMLAttributes', 'LabelHTMLAttributes', 'FormHTMLAttributes', 'ImgHTMLAttributes' 등이 존재합니다.

> 또한 Generic에 사용된 'HTML\*\*\*Element' 타입도 여러 가지가 존재합니다: 'HTMLInputElement', 'HTMLButtonElement', 'HTMLImageElement', 'HTMLTextAreaElement' 등. IDE의 자동 완성 기능을 활용하여 작성하려는 태그에 적합한 타입을 선택하는 것이 좋습니다.

```ts
// 이메일 유효성 검사 등에 사용할 errorMessage를 추가해보았습니다.
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
}

const Input = ({ errorMessage, ...rest }: InputProps) => {
  return (
    <>
      <input {...rest} />
      {errorMessage && <p>{errorMessage}</p>}
    </>
  )
}
```

더욱 간단하면서 확장성 있는 컴포넌트를 작성할 수 있게 되었습니다. 이러한 방법을 잘 사용하면 컴포넌트 유지 보수에도 더욱 용이할 것입니다.

## Story 구성

앞서 작성한 **Input component** 코드를 `/stories` 디렉토리에 `inputs` 폴더를 만들어 별도의 파일로 만들겠습니다(`/stories/inputs/input.tsx`). 또한 동일 폴더에 `input.stories.ts` 파일을 생성하고, `Button.stories.ts` 파일의 내용을 복사하여 붙여넣기 하겠습니다.

```ts
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Example'

const meta = {
  // Storybook 폴더 계층 구조
  title: 'Example/Button',
  // Story 생성에 사용할 컴포넌트
  component: Button,
  // Story에 대한 정적 메타데이터(Storybook 기능과 동작 제어)
  parameters: {
    layout: 'centered',
  },
  // tags의 경우 autodocs 외에 다른 기능을 아직 모르겠습니다
  tags: ['autodocs'],
  // args에 대한 타입을 지정하거나 명시적으로 설정되지 않은 args를 제공
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Button component에 대한 스토리들
export const Primary: Story = {
  // Button component에 필요한 props
  args: {
    primary: true,
    label: 'Button',
  },
}

// ...이하 생략
```

> Typescript를 사용하지 않는 경우 파일 확장자를 ts -> js로 생성해 주세요.

위 코드의 **Meta**에 나오지 않은 다른 속성들(decorators 등) 또한 존재합니다...만 공식문서에서도 Meta에 대해 정리해놓은게 없어서, 이 부분은 추후에 정리하도록 하겠습니다.

일단, Input component의 스토리를 생성하기 위해 위 코드를 아래와 같이 바꿔줍니다.

```ts
import type { Meta, StoryObj } from '@storybook/react'
import Input from './Input'

const meta = {
  title: 'CommonUI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input> // 이 부분도 바꿔주어야 합니다.

export default meta
type Story = StoryObj<typeof meta>

export const DefaultInput: Story = {
  args: {},
}

export const ErrorInput: Story = {
  args: {
    errorMessage: 'This is error message for input.',
  },
}
```

코드를 작성하고 나서 스토리북 사이드바를 확인하면 `CommonUI` 디렉토리 아래에 `Input`이라는 폴더 구조가 생긴 것을 확인할 수 있습니다. 스토리북의 **Controls** 탭에서 args(props)를 변경해보며 출력이 잘 되고 있는지 확인해 보세요.

![Storybook-2-2](/assets/images/React/Storybook-2-2.PNG)

## Styled-component using @emotion/styled

아마 여러분이 작성하신 스토리를 눈으로 확인해보면 위 사진과 조금 다르다는 것을 알 수 있을텐데요, 그 이유는 아직 **스타일**을 입혀주지 않았기 때문입니다.

React에서 CSS를 작성하는 방법에도 여러 가지가 있습니다만, 이번 장에서는 내용이 길어져서 각설하겠습니다. 앞으로 저는 `@emotion/styled` 라이브러리를 사용할 것입니다. 이번에는 '아! 이렇게 사용하는구나' 정도만 느껴보도록 합시다.

먼저 `input.tsx` 파일에서 밋밋한 input 태그와 p 태그를 Styled component로 변경해 보겠습니다.

```ts
// color에 대한 정의 파일입니다. 나중에 작성하셔도 무방합니다.
import { colors } from 'lib/colors'
/* ... 중간 생략 ... */

const Input = ({ errorMessage, ...rest }: Props) => {
  return (
    <>
      <StyledInput {...rest} />
      {errorMessage && <StyledMessage>{errorMessage}</StyledMessage>}
    </>
  )
}

// `(Backtick)을 사용해야 합니다.
// Template literal을 통해 js로 작성된 상수를 직접 넣어줄 수도 있습니다.
const StyledInput = styled.input`
  width: 100%;
  border: 1px solid ${colors.gray2}; 
  border-radius: 0.4rem;
  font-size: 1.4rem;
  padding: 0.4rem; 1.6rem;
  color: ${colors.gray5};
  transition: all 0.5s ease;
`

const StyledMessage = styled.p`
  margin: 1.2rem 0 0;
  font-size: 1.4rem;
  color: ${colors.error};
`
```

위 코드는 CSS-in-JS라 불리는 코드 작성 방식 중 하나입니다. 저는 스크립트에서 쓰이는 상수, props, 함수 등을 css 안에서 가져다 쓰기 편하다는 점 때문에 애용하고 있습니다. css는 작성 방식보다 각 속성에 대해 이해하고 사용하는 것이 중요하다고 생각합니다.

## 마치면서

이번 장에서는 간단한 Input component를 만들어보며 Interface 정의 방법과 스토리 작성법, 그리고 styled component에 대해 간략하게 알아보았습니다. 다음 장에서부터는 Input component를 활용한 다른 컴포넌트들도 만들어보며 구체적인 내용들에 조금씩 접근해보도록 하겠습니다.
