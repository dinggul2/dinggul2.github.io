---
published: true
title: '[React] 3. Common UI 개발하기 - Checkbox 편'
categories:
  - React
tags:
  - [react, storybook, input, checkbox]
toc: true
toc_sticky: true
toc_label: '목차'
date: 2023-09-12
last_modified_at: 2023-09-12
---

## Checkbox component

> [**Checkbox**](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/checkbox){: target="\_blank"} element는 폼 안에서 선택된 단일 값들을 제출할 수 있는 기능을 제공합니다.

![Checkbox](/assets/images/React/checkbox.png){: width="50%" height="50%"}{: .align-center}_누구나 다 아는 체크박스_{: .text-center}

<br>
웹에서 체크박스는 주로 사용자로부터 동의를 받기 위해 사용합니다. 단일로 사용하기보다 그룹으로 사용되는 경우가 많죠. 비슷한 버튼으로는 라디오 버튼이 있습니다. 라디오 버튼과 차이점이라면, 체크박스는 그룹으로 사용될 때 그 안에서 여러 요쇼를 선택할 수 있다는 점입니다.

이번 포스트에서는 단일 Checkbox 컴포넌트를 먼저 구현해보겠습니다.

---

## Interface 정의

`React.InputHTMLAttributes`를 사용할 수도 있지만, 이번 포스트에서는 필요한 속성만 직접 정의하였습니다.

```ts
interface Props {
  checked: boolean
  disabled?: boolean
  children: ReactNode
  onChange(event: ChangeEvent<HTMLInputElement>): void
}
```

먼저 체크박스에 대한 선택 여부(`checked`)와 상태 업데이트 함수(`onChange`)를 외부에서 전달받도록 정의하였습니다. 여기서 **`React.ReactNode`** 속성이 조금 생소할 수 있는데요, `ReactNode`에 대한 타입은 `React namespace`에서 찾아볼 수 있습니다.

```ts
declare namespace React {
  type ReactNode =
    | ReactElement
    | string
    | number
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined
}
```

`ReactNode` 타입을 사용하면 **string, number, boolean**과 같은 원시값 뿐만 아니라 **JSX**도 전달 가능해집니다. 조금 더 범용성 있게 사용 가능하겠죠?

---

## Component 정의

기본적으로 체크박스는 HTML에서 `<input>` 요소의 `type` 속성에 `'checkbox'`값을 전달해주면 만들어집니다. 체크박스의 텍스트를 클릭했을 때에도 선택이 될 수 있도록 `<label>` 요소로 `<input>` 요소를 감싸주었습니다.

```tsx
const Checkbox = ({ checked, disabled = false, children, onChange }: Props) => {
  return (
    <StyledLabel disabled={disabled}>
      <StyledCheckbox type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
      {children}
    </StyledLabel>
  )
}

const StyledCheckbox = styled.input``

const StyledLabel = styled.label``
```

> [**`label`**](https://developer.mozilla.org/ko/docs/Web/HTML/Element/label){: target="\_blank"} element의 `for`와 `id` 속성을 이용하여 텍스트를 클릭했을 때 체크박스가 선택되도록 만들 수도 있습니다.

비교적 간단하게 만들어진 것 같네요. 스타일 요소를 구현하기 전에, Story를 먼저 만들어보겠습니다.

---

## Story 구성

[이전 포스트](https://dinggul2.github.io/react/React-Storybook-2/)에서 Story의 **Meta**에 관한 정의를 보셨을 겁니다. `Checkbox` 컴포넌트에서도 크게 다르지 않지만, 마지막으로 한 번 설명하고 이후에는 생략하겠습니다.

> `Input`으로 되어있는 부분을 모두 `Checkbox`로 바꾸어 주세요.

```ts
import type { Meta, StoryObj } from '@storybook/react'
import Checkbox from './Checkbox'

const meta = {
  title: 'CommonUI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>
```

이어서 같은 파일에 `Checkbox` 컴포넌트의 기본 스토리가 될 `Template` 변수를 선언하고, 해당 변수를 이용하여 원하는 만큼 스토리를 생성해 줍시다. 사실 이번에도 생성할 스토리의 Variation이 몇 개 없지만, 이후에 스토리가 여러 개 필요한 경우를 대비하여 미리 보여드리고 넘어가겠습니다.

```tsx
// ...생략
import { ChangeEvent } from 'react'
import { useArgs } from '@storybook/addons'

const Template: Story = {
  render: ({ checked, children, ...args }) => {
    const [_, updateArgs] = useArgs()

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      updateArgs({ checked: event.target.checked })
    }

    return (
      <Checkbox {...args} checked={checked} onChange={handleChange}>
        {children}
      </Checkbox>
    )
  },
  args: {
    checked: false,
    disabled: false,
    children: 'Default Checkbox',
  },
}

export const DefaultCheckbox: Story = {
  ...Template,
}

export const DisabledCheckbox: Story = {
  render: Template.render,
  args: {
    ...Template.args,
    disabled: true,
  },
}
```

**args** 에 관한 내용은 [이곳](https://storybook.js.org/docs/react/writing-stories/args){: target="\_blank"}에서 찾아볼 수 있습니다. 간단하게 설명하면, `Story`는 렌더링된 UI 컴포넌트의 **상태(state)**를 캡처합니다. 이 때 `args`는 렌더링에 필요한 동적 데이터라고 할 수 있습니다. `args`를 스토리마다 다르게 부여하면 각기 다른 스토리를 렌더링 할 수 있다는 뜻입니다.

> `args` 객체는 기본적으로 meta 객체의 component 속성에 정의한 컴포넌트가 갖는 `props` 객체와 동일한 키와 매칭되는 타입으로 구성되어 있습니다.

**render** 함수는 컴포넌트가 렌더링 되는 방식을 제어합니다. 기본적으로는 정의하지 않아도 되지만, 이번에는 `useArgs` 함수에 대해 설명드리기 위해서 등장하였습니다.

아마 여러분이 `render` 함수를 생략하고 스토리를 생성하면, _렌더링된 컴포넌트를 클릭하여도 아무런 반응이 없을 것입니다._ **Control** 패널에서만 `checked` args를 변경할 수 있죠. 이것도 나쁘지 않지만, 저는 실제로 컴포넌트가 의도한 대로 동작하는지 확인하기 위해 컴포넌트의 **텍스트** 부분을 눌렀을 때 체크가 되길 원합니다. 그리고 동시에 `checked` args도 바뀌길 바라죠. 따라서 저는 `render` 함수에서 `useArgs`를 통해 `checked` args를 업데이트하기 위한 함수 `handleChange`를 정의하고 `Checkbox` 컴포넌트의 `onChange`에 전달하여 새로 정의한 컴포넌트를 렌더링하도록 반환하였습니다. 다시 스토리북에서 `Checkbox` 컴포넌트의 텍스트를 누르면 체크가 되는 것과 동시에 `checked` args가 변하는 모습을 보실 수 있을 겁니다.

스토리에 포함될 수 있는 속성은 `args`, `render` 외에도 몇 가지 더 있습니다. 핵심적인 두 속성에 대한 설명을 드렸고, 중요한 내용이 있으면 앞으로 더 추가하겠습니다.

---

## Style 정의

이전 포스트에서 설명드렸던 것처럼, 스타일은 `@emotion/styled` 라이브러리를 이용한 `CSS-in-JS` 방식으로 입혀주었습니다.

```ts
const StyledCheckbox = styled.input<{ disabled?: boolean }>`
  appearance: none;
  margin: 0 1.2rem 0 0;
  width: 2rem;
  height: 2rem;
  border: 0.2rem solid ${colors.gray1};
  border-radius: 0.4rem;
  position: relative;
  top: 0.1rem;
  transition: all 0.25s;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: ${colors.primary};
  }

  ${(props) =>
    props.disabled &&
    css`
      border-color: ${colors.gray0};

      &:checked {
        background-color: ${colors.gray1};
      }
    `}
`

const StyledLabel = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: ${colors.gray4};
  transition: all 0.25s;

  ${(props) =>
    props.disabled &&
    css`
      color: ${colors.gray1};
    `}
`
```

이전과 조금 다른 점이라면 `props`를 다루는 모습이 추가되었습니다. 체크박스가 사용 불가한 상태를 다르게 보여주기 위해, `Checkbox` 컴포넌트의 `Props` interface에서 `disabled` 속성만 `props`로 전달받기를 원합니다. 먼저 Generic에 `Props` interface를 통째로 전달하는 대신 `disabled` 속성만 추출하여 전달하였습니다. 그리고 `props.disabled`가 참이 되는 경우의 css를 추가해주었는데요, 형태만 기억하면 편하게 따라 만드실 수 있을 거라고 생각합니다.

## 마치면서

이번 장에서는 간단한 **Checkbox component**를 만들어 보면서 스토리를 구성하는 방법에 대해 자세히 살펴보았습니다. `useArgs`라는 API를 찾아보는데 시간을 많이 들인 것 같네요. 사용하시는 버전마다 차이가 있을 수 있으니 이 점 유의하시길 바랍니다. 다음 장에서는 `Checkbox` 컴포넌트를 여러 개 사용하는 **Checkbox Group component**를 만들어보도록 하겠습니다.
