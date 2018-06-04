<template>
    <div class="giveMoney">
        <img :src="security" alt="banner" class="Security">
        <div class="give-words">
            <div class="give-words-tip">
                押金仅用于保证货架安全，可<b>随时退回</b>
            </div>
            <div class="give-button">
               交99元押金
            </div>
        </div>
    </div>
</template>
<script>
import security from '../assets/offerMoney.png'
export default {
    data() {
        return {
             security
        }
    },
    created(){
        const titleNode = document.querySelector('title');
        titleNode.innerText = `缴纳押金`;
    }
}
</script>
<style>
.Security{
    display: inline-block;
    width:100%;
    /* height:23rem; */
}
.give-words{
    margin-top:4rem;
    text-align: center;
    font-size: 14px;
}
.give-words-tip{
    color:#283241;

}
.give-button{
    background: #FFC700;
    color: #fff;
    font-size: 1rem;
    margin-top: 1rem;
    height: 2.5rem;
    line-height: 2.5rem;
    border-radius: .3rem;
    margin: 1rem 2rem 0;

}
</style>
