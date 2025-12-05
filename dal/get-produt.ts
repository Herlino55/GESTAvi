export const getProduct = async (company: any) => {
    console.log("Getting product for company:", company);
//   const options = {
//   method: 'GET',
//   headers: {Authorization: `Bearer ${company.accesstoken}`, 'Content-Type': 'application/json'},
//   body: JSON.stringify({
//     content: 'body_html',
//     handle: 'handle-herzcde',
//     metadata: {shopifyId: 'id'},
//     title: 'Title'
//   })
// };



const options = {method: 'GET', 
  headers: {Authorization: `Bearer ${company.accessToken}`, 'Content-Type': 'application/json',"X-Company": company.id},
};



fetch('https://api-staging.genuka.com/2023-11/admin/products/', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
}