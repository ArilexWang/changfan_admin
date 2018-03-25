<template>
    <section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <div></div>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="订单信息"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form-item>
                
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="objects" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="fields._detailName" label="维修问题" width="200" sortable>
            </el-table-column>
            <el-table-column prop="fields._detailPrice" label="价格" width="80" sortable>
            </el-table-column>
            <el-table-column prop="fields._modelName" label="型号" width="120" sortable>
            </el-table-column>
            <el-table-column prop="fields._reserveTime" label="下单时间" width="140" sortable>
            </el-table-column>
            <el-table-column prop="fields._serveTime" label="预约时间" width="140" sortable>
            </el-table-column>
            <el-table-column prop="fields._staffComment" label="备注" width="140" sortable>
            </el-table-column>

            <el-table-column label="操作" width="300">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
                    <el-button v-if="scope.row.fields._orderStatus === 0" size="small" @click="handleAccept(scope.$index,scope.row)">接单</el-button>
                    <el-button v-if="scope.row.fields._orderStatus === 3" size="small">已接单</el-button>
                    <el-button v-if="scope.row.fields._orderStatus === 1" size="small">已支付</el-button>
                    <el-button v-if="scope.row.fields._orderStatus === 2" size="small">已取消</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">取消接单</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--编辑界面-->
        <el-dialog title="详细信息" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="维修问题" prop="modelID">
                    <el-input v-model="editForm._detailName" readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="categoryID">
                    <el-input v-model="editForm._userName" readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="name">
                    <el-input v-model="editForm._contactTel" readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="维修地址" prop="price">
                    <el-input v-model="editForm._address" readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="维修方式" prop="repairMethod">
                    <el-input v-if="!editForm._orderType" readonly="true" value="上门维修" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="price">
                    <el-input v-model="editForm._staffComment" auto-complete="off"></el-input>
                    <el-button @click.native="commentSubmit" style="margin-top:10px">保存备注</el-button>
                </el-form-item>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="型号ID" prop="modelID">
                    <el-input v-model="addForm.modelID" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="故障大类ID" prop="categoryID">
                    <el-input v-model="addForm.categoryID" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="故障名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="addForm.price" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="修理方法" prop="repairMethod">
                    <el-input v-model="addForm.repairMethod" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="修理时长" prop="repairDuration">
                    <el-input v-model="addForm.repairDuration" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="修理说明" prop="repairInstructions">
                    <el-input v-model="addForm.repairInstructions" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="热门维修" prop="repairInstructions">
                    <el-switch v-model="addForm.isPopular" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--工具条-->
        <!--<el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>-->

    </section>
</template>

<script>
import util from '../../common/js/util'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getAllMalfunctionCategory, getAllOrder } from '../../api/api';
import CityInfo from '../../common/js/city-data'
import base_image_url from '../../common/js/base_url'
import Form from './Form'
import host from '../../common/js/host'
export default {
    data() {
        return {
            filters: {
                name: ''
            },
            components: {
                Form
            },
            users: [],
            total: 0,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            brandID: 0,
            brandName: "",
            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
               
            },
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
            },
            objects: [],
            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ]
            },
            //新增界面数据
            addForm: {
                id: 0,
                name: '',

            },
            main_banners: [],
            postData: {
                token: '93L43E91oA1cbC9k40ZK2eSeOCqxxjJz1SsL4NGv:QF7ZWpzyVCD1_vuo3GJhCovSoAI=:eyJzY29wZSI6IjUxYmllc2h1IiwiZGVhZGxpbmUiOjE5NTE1NTkxNDR9'
            },
            previewImageUrl: '',
            dialogVisible: false,
            villas: []

        }
    },
    methods: {
        //预览图片
        handlePictureCardPreview(file) {
            this.previewImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleAvatarSuccess(res, file) {
            console.log(file)
            this.editForm.thumbnail = base_image_url + res.key
            console.log(this.editForm)
        },
        createAvatarSuccess(res, file) {
            console.log(file)
            this.addForm.thumbnail = base_image_url + res.key
            console.log(this.editForm)
        },
        //上传成功
        handleBannerSuccess(res) {
            var imgurl = base_image_url + res.key
            var dic = {}
            dic.url = imgurl
            this.main_banners.push(dic)
        },
        handleBannerRemove(file, fileList) {
            var index = this.main_banners.indexOf(file)
            this.main_banners.splice(index, 1)
        },

        //删除
        handleDel: function(index, row) {
            var _orderType = 0
            if(row.model == "scavenger.repairorder"){
                _orderType = 1
            } else if (row.model == "scavenger.recycleorder"){
                _orderType = 2
            }
            this.listLoading = true;
            var para = { orderID:row.pk, orderType: _orderType, status:2 }
            this.$http.post(host + "setOrderStatus/", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
                this.listLoading = false;
                console.log(response)
                this.getMalfunctionDetail()
            }).catch(function(error) {
                console.log(error)
            })
        },
        //显示编辑界面
        handleEdit: function(index, row) {
            this.editFormVisible = true;
            // console.log(row)
            this.editForm = Object.assign({}, row.fields);
            this.editForm.orderID = row.pk;
            this.editForm.model = row.model;
        },
        //显示新增界面
        handleAdd: function() {
            this.addFormVisible = true;
            this.addForm = {
                isPopular: 0
            }
        },
        handleComment: function(index, row) {
            var _id = this.villas[index].brandID
            this.$router.push({ name: '型号', path: '/form', params: { id: _id } })
        },
        handleAccept: function(index, row){
            console.log(row)
            var _orderType = 0
            if(row.model == "scavenger.repairorder"){
                _orderType = 1
            } else if (row.model == "scavenger.recycleorder"){
                _orderType = 2
            }
            this.listLoading = true;
            var para = { orderID:row.pk, orderType: _orderType, status:3 }
            this.$http.post(host + "setOrderStatus/", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
                this.listLoading = false;
                console.log(response)
                this.getMalfunctionDetail()
            }).catch(function(error) {
                console.log(error)
            })
        },

        //编辑
        editSubmit: function() {
            this.$refs.editForm.validate((valid) => {
                this.editFormVisible = false;
                this.getMalfunctionDetail();
            });
        },
        //新增
        addSubmit: function() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        var para = Object.assign({}, this.addForm);
                        console.log(para)
                        var params = JSON.stringify(para)
                        console.log(params)
                        this.$http.post(host + "createMalfunctionDetail/", params, { headers: "Content-Type:application/json" }).then(function(response) {
                            this.addLoading = false;
                            console.log(response)
                            this.addFormVisible = false;
                            this.getMalfunctionDetail()
                        }).catch(function(error) {
                            console.log(error)
                        })
                    });
                }
            });
        },
        selsChange: function(sels) {
            this.sels = sels;
        },
        //批量删除
        batchRemove: function() {
            var ids = this.sels.map(item => item.id).toString();
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                //NProgress.start();
                let para = { ids: ids };
                batchRemoveUser(para).then((res) => {
                    this.listLoading = false;
                    //NProgress.done();
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getUsers();
                });
            }).catch(() => {

            });
        },
        getMalfunctionDetail: function() {
            this.objects = []
            getAllOrder().then((res) => {
                console.log(res.data)
                this.objects = res.data  
            })
        },
        commentSubmit:function(){
            console.log(this.editForm)
            var _orderType = 0
            if(this.editForm.model == "scavenger.repairorder"){
                _orderType = 1
            } else if (this.editForm.model == "scavenger.recycleorder"){
                _orderType = 2
            }
            var para = { orderID: this.editForm.orderID, orderType: _orderType, staffComment: this.editForm._staffComment }
            this.$http.post(host + "setOrderStaffComment/", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
                console.log(response)
            }).catch(function(error) {
                console.log(error)
            })

        }
    },

    mounted() {
        this.getMalfunctionDetail()
    },

}

</script>

<style scoped>

</style>