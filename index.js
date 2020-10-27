// ==UserScript==
// @name         AddRelatedGoods
// @name:ru      Добавить сопутствующие товары
// @description  Добавляет к растворам в сопуствующие товары перчатки, маски и другое
// @namespace    https://vk.com/omario97
// @version      0.2
// @updateURL    https://raw.githubusercontent.com/SonOfStep/AddRelatedGoods/main/index.js
// @authot       Omar "SonOfStep" Nurmakhanov
// @match        *://172.30.149.11:8282/OE/appointment/remsandapps*
// @grant 		 none
// ==/UserScript==

const TOKEN = $('input[name="YII_CSRF_TOKEN"]').val() //Токен

const getUnitMeasurement = ( id, token ) => {
  return new Promise(
    ( resolve, reject ) => {
      let request = $.ajax({
        'type': 'POST',
        url: '/OE/appointment/getnamedzbyrems',
        data: {
          remid: id,
          YII_CSRF_TOKEN: token 
        }
      })

      request.done( data => { 
        $(`#attend_doze_izm${ id }`).append( data )
        resolve( data )
      } )
      request.fail( error => reject(error) )
    }
  )
}

const getRelatedGoods = ( name, id, token ) => {
  return new Promise(
    ( resolve, reject ) => {
      let request = $.ajax({
        'type': 'GET',
        url: `/OE/appointment/getdrugidbyattend?ima=${name}&appid=${id}&YII_CSRF_TOKEN=${token}`
      })

      request.fail( error => reject( `Ошибка от сервера: ${error}` ) )
      request.done( data =>  {
        let product = JSON.parse( data )
        let elem = `<div class="attend_contaner" data-remid="${ product[0].id }" style="margin:5px 3px; padding: 3px;">
<div class="wd750" style="display: inline-block; vertical-align:middle; font-size: 9pt; border: 1px solid #aaa; border-radius: 4px; height: 28px; padding: 4px 8px; overflow: hidden;">${ product[0].text }</div>
<img data-id="${ product[0].id }" class="delete_attend_ls" title="Удалить сопутствующее ЛС" src="/OE/assets/df8a2a5e/img/delete3.png">
<div class="selecttp right wd120" style="vertical-align:middle;"><select name="attend_doze_izm${ product[0].id }" id="attend_doze_izm${ product[0].id }" class="selectelem attend_doze_izms"></select></div>
<input placeholder="Укажите дозу..." data-remid="${ product[0].id }" id="attend_doze${ product[0].id }" class="input2 right wd120 attend_dozes" style="margin-right: 3px; vertical-align:middle;">
</div>`
        $('#block_attend').append( elem )

        resolve( product )
      } )
    }
  )
}

const addRelatedGoods = ( name, id, token ) => {
  getRelatedGoods( name , id, token ).then(
    result => getUnitMeasurement( result[0].id, token ).then(
      result => console.log( result ),
      error => console.log( error )
    ),
    error => console.log( error )
  )
  $('.dlv_rems_cntnt_block .inp_dz').val('2')
  $('.dlv_rems_cntnt_block .deliv_izm').val('1')
}

$('#confmovdr').on('click', () => {
  let isSoluble = $('#add_delivery_drug .nm_block2').text().includes('р-р')

  if ( isSoluble ) {
    addRelatedGoods( 'Перчатки', $('#appid_deliv').val(), TOKEN )
    addRelatedGoods( 'Маска', $('#appid_deliv').val(), TOKEN )
    addRelatedGoods( 'Шприц', $('#appid_deliv').val(), TOKEN )
  }
})

