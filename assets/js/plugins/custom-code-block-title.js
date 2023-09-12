const highlightBlocks = document.querySelectorAll('.highlight')

for (i = 0; i < highlightBlocks.length; i++) {
  const highlightBlock = highlightBlocks[i]

  // check if custom label is already made
  if (highlightBlock.previousElementSibling.classList.contains('codeblock-label')) continue

  // get language data
  // const codes = highlightBlock.querySelectorAll('[data-lang]')
  // const lang = codes[0].getAttribute('data-lang')

  // create label element
  const label = document.createElement('p')
  label.classList.add('codeblock-label')
  label.innerHTML = 'lang'

  // insert label
  highlightBlock.parentNode.insertBefore(label, highlightBlock)
}
