---
published: true
title: '[React] 4. Common UI 개발하기 - CheckboxGroup 편'
categories:
  - React
tags:
  - [react, storybook, input, checkbox]
toc: true
toc_sticky: true
toc_label: '목차'
date: 2023-09-15
last_modified_at: 2023-09-15
---

## CheckboxGroup component

> 이번 장은 [DaleSeo](https://www.daleseo.com/react-checkboxes/){: target="\_blank"}님의 블로그를 참조하여 작성하였습니다.

[이전 장](https://dinggul2.github.io/react/React-Storybook-3/){: target="\_blank"}에서 `<Checkbox>` 컴포넌트를 만들어 보았습니다. 체크박스를 단일로 사용하는 경우는 드물기 때문에, 여러 개의 체크박스를 묶은 그룹 컴포넌트를 미리 만들어두면 사용하기 편하겠죠? 이번 장에서는 `<CheckboxGroup>` 컴포넌트를 두 가지 버전으로 만들어보려 합니다. 하나는 기존에 제가 사용하던 방식이고, 다른 하나는 **DaleSeo** 님의 블로그를 참조하여 만든 `Context API` 버전입니다.

> **Context API**에 대한 내용은 [관련 포스팅](https://react.dev/learn/passing-data-deeply-with-context){: target="\_blank"}을 참고해주세요.

먼저 제가 만든 ~~싸구려~~ 버전부터 시작하겠습니다.

---

## Version 1: without Context API

### Interface 정의

제가 이전에 사용하던 버전은, `<CheckboxGroup>` 컴포넌트 안에서 `<Checkbox>` 컴포넌트를 불러다 미리 정의해놓았습니다. 그래서 인터페이스가 다소 장황할 수 있습니다.

```ts
interface Item {
  value: string | number
  disabled?: boolean
  children: React.ReactNode
}

interface Props {
  items: Item[]
  selectedValues: (string | number)[]
  groupDisabled?: boolean
  onChange(values: (string | number)[]): void
}
```

`Item`은 체크박스에 대한 내용입니다. 아래 컴포넌트 사용 예시를 보면 바로 이해하실 수 있습니다.

`selectedValues`는 선택한 체크박스의 `value`속성 값들을 담은 배열입니다.

> React의 `useState()` 훅이 사용됩니다. 자세한 내용은 [관련 포스팅](https://react.dev/learn/state-a-components-memory){: target="\_blank"}을 참고해 주세요.

### Component 구현

사실 이전에는 이 코드보다 복잡했는데, Version 2를 쉽게 설명하기 위해서 손을 좀 봤습니다. 먼저 `<App>`에서 `<CheckboxGroup>` 컴포넌트를 어떻게 사용하는지 그 형태부터 살펴보겠습니다.

_App.tsx_

```tsx
function App() {
  const items = [
    {
      value: 'children1',
      children: 'children1',
      disabled: false,
    },
    {
      value: 'children2',
      children: 'children2',
      disabled: false,
    },
  ]

  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([])

  return (
    <>
      <CheckboxGroup items={items} selectedItems={selectedItems} onChange={setSelectedItems} />
      <p>{`Check된 Items: ${selectedItems.join(' ')}`}</p>
    </>
  )
}
```

_CheckboxGroup.tsx_

```tsx
const CheckboxGroup = ({ items, selectedValues, groupDisabled = false, onChange }: Props) => {
  const isChecked = (value: string | number) => selectedValues.includes(value)

  const isDisabled = (disabled?: boolean) => disabled || groupDisabled

  const handleChange = ({ checked, value }: { checked: boolean; value: string | number }) => {
    if (checked) {
      onChange([...selectedValues, value])
    } else {
      onChange(selectedValues.filter((v) => v !== value))
    }
  }

  return (
    <StyledDiv>
      {items.map((item) => (
        <Checkbox
          key={item.value}
          value={item.value}
          checked={isChecked(item.value)}
          disabled={isDisabled(item.disabled)}
          onChange={(event) => handleChange({ checked: event.target.checked, value: item.value })}>
          {item.children}
        </Checkbox>
      ))}
    </StyledDiv>
  )
}
```

`<Checkbox>` 컴포넌트를 `<CheckboxGroup>` 컴포넌트 안에서 구현했기 때문에, `items`라는 배열이 따로 존재하는 모습입니다. 적당히 잘 동작하고 그럴싸해 보이지만 `div` 안에 버튼이나 라벨을 추가하기에는 구조가 좋지 않아 보입니다. `items`라는 배열을 생성해서 전달해주어야 한다는 점도 직관적이지 못한 것 같네요.

다음 버전과 비교해 보면 차이를 느끼실 수 있을 것 같습니다.

---

## Version 2: With Context API

### Interface 정의

**Context API**를 사용하면서 더 이상 `items` 배열을 사용하지 않기 떄문에 `Item` 인터페이스가 사라졌습니다.

```tsx
interface Props {
  selectedValues: (string | number)[]
  groupDisabled?: boolean
  children: React.ReactNode
  onChange(values: (string | number)[]): void
}
```

`children`은 `<Checkbox>`나 기타 컴포넌트가 삽입될 위치를 정하기 위해 사용됩니다.

### Component 구현

`items` 배열이 사라지고, 대신 `<CheckboxGroup>` 컴포넌트의 `children`자리에 `<Checkbox>` 컴포넌트를 삽입하고 있습니다.

```tsx
function App() {
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([])

  return (
    <>
      <CheckboxGroup selectedValues={selectedItems} onChange={setSelectedItems}>
        <Checkbox value="checkbox1">체크박스 1</Checkbox>
        <Checkbox value="checkbox2">체크박스 2</Checkbox>
        <Checkbox value="checkbox3" disabled>
          체크박스 3
        </Checkbox>
      </CheckboxGroup>
      <p>{`Check된 Items: ${selectedItems.join(' ')}`}</p>
    </>
  )
}
```

#### Context.Provider

```tsx
import CheckboxContext from 'context/checkboxGroup'

const CheckboxGroup = ({ selectedValues, groupDisabled = false, children, onChange }: Props) => {
  const isChecked = (value: string | number) => selectedValues.includes(value)
  // 생략...
  // isChecked, isDisabled, handleChange 함수는 Version 1과 동일합니다.

  return (
    <StyledFieldset>
      <CheckboxContext.Provider value={{ isChecked, isDisabled, handleChange }}>
        {children}
      </CheckboxContext.Provider>
    </StyledFieldset>
  )
}
```

`App`에서 `CheckboxGroup`을 사용하는 모습이 이전보다 직관적이고 간편해 보이지 않나요? 하지만 문제는 `Checkbox` 컴포넌트가 어떻게 `isChecked, isDisabled, handleChange` 함수를 사용하는가 입니다. 이전에는 체크박스가 `CheckboxGroup` 컴포넌트 안에 있었기 때문에 `props`로 내려주었지만, 이 구조에서는 불가능해 보입니다.

그래서 **Context API**가 필요합니다. Context API는 전역 데이터를 다루기 위해서도 사용하지만, `props`만으로 도달하기 어려운 경우 컴포넌트 간 데이터 전달을 위해서도 사용합니다. 위 예시에서는, `CheckboxContext.Provider`의 `children` 자리에 들어올 컴포넌트들이 Provider의 `value`에 정의한 함수들을 사용할 수 있도록 만든 구조입니다.

`CheckboxContext.Provider`를 사용하기 위해서는 먼저 `Context`를 정의해야 합니다. contexts 폴더를 하나 만들고, 적당한 이름의 파일을 만들어 주세요.

_context/checkboxGroup.tsx_

```tsx
import { createContext } from 'react'

interface CheckboxGroupContext {
  isChecked(value?: string | number): boolean
  isDisabled(disabled?: boolean): boolean
  handleChange({ checked, value }: { checked: boolean; value: string | number }): void
}

// default값은 null이 되도록 전달해주었습니다.
const CheckboxContext = createContext<CheckboxGroupContext | null>(null)

export default CheckboxContext
```

그리고 `CheckboxContext.Provider`가 공유해준 함수들을 사용하기 위해 `<Checkbox>` 컴포넌트를 수정해야 합니다.

_src/checkbox.tsx_

```tsx
// ...생략
import CheckboxContext from 'context/checkboxGroup'

const Checkbox = ({ value, checked, disabled = false, children, onChange }: Props) => {
  const context = useContext(CheckboxContext)

  // 기존 Checkbox
  if (context === null) {
    return (
      <StyledLabel disabled={disabled}>
        <StyledCheckbox
          type="checkbox"
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
        {children}
      </StyledLabel>
    )
  }

  // 새로 추가된 Checkbox
  const { isChecked, isDisabled, handleChange } = context

  return (
    <StyledLabel disabled={disabled}>
      <StyledCheckbox
        type="checkbox"
        value={value}
        checked={isChecked(value)}
        disabled={isDisabled(disabled)}
        onChange={(event) => handleChange({ checked: event.target.checked, value })}
      />
      {children}
    </StyledLabel>
  )
}
```

먼저 `useContext` 훅 함수를 사용하여 `CheckboxContext`를 `context` 변수에 할당합니다.

`<Checkbox>` 컴포넌트가 `<CheckboxGroup>` 안에서 사용되지 않을 경우 `context`는 `null`이 됩니다. 이 경우 분기문을 통해 [이전 장](https://dinggul2.github.io/react/React-Storybook-3/){: target="\_blank"}의 `<Checkbox>`를 그대로 사용하도록 하였습니다.

`context`가 `null`이 아닌 경우 어떤 **객체**가 변수에 할당됩니다. 이 객체는 [`CheckboxContext.Provider`](###Context.Provider)의 `value` 속성이 제공한 객체를 담고 있습니다. 해당 객체가 제공한 `isChecked, isDisabled, handleChange` 함수를 구조 분해 할당하고, `<Checkbox>` 컴포넌트 속성에서 사용하였습니다.

## 마치면서

이번 장에서는 **Context API** 를 중심으로 컴포넌트를 구현하는 방법에 대해 알아보았습니다. 글을 쓰고 있는 저도 사실 React 초보입니다. 저와 같은 초보자 분들께, 조금이라도 도움이 되길 바라면서 다음 장에서는 비슷한 구현사항을 가진 `<Radio>` 컴포넌트로 찾아뵙겠습니다.
