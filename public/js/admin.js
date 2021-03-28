const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('input[name=productId]').value;
  const csrfToken = btn.parentNode.querySelector('input[name=_csrf]').value;
  const productElement = btn.closest('article.card');
  fetch(`/admin/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'CSRF-Token': csrfToken // asked by csrf module
    }
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch(e => {
      console.log(e);
    });
}