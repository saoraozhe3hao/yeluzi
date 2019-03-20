<template>
  <el-dialog :visible.sync="show" width="900px" :append-to-body="true" class="carousel-dialog" :close-on-click-modal="false">
    <el-carousel ref="carousel" :autoplay="false" arrow="always" height="500px">
      <el-carousel-item v-for="(item,index) in images" :key="index" :label="item.label">
        <img :src="item.src"/>
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
export default {
    props: ['value','visible','images', 'activeIndex'],  // value即上层传进来的model
    data(){
        return {
            show: this.visible
        }
    },
    watch:{
        show: function(val){
            this.$emit('update:visible', val);    // 通知上层更改传进来的 visible.sync
        },
        visible: function (val) {
            this.show = val;
        },
        activeIndex: function (val) {
            this.$refs.carousel.setActiveItem(val);
        }
    },
    methods: {

    }
}
</script>

<style lang="less">
  .carousel-dialog{
    .el-carousel__item{
      overflow: auto;
      img{
        width: inherit;
      }
    }
  }
</style>
