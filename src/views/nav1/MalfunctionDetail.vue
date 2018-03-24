<template>
    <section>

        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <div></div>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="故障大类"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="objects" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="120" sortable>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌" width="120" sortable>
            </el-table-column>
            <el-table-column prop="modelName" label="型号名" width="120" sortable>
            </el-table-column>
            <el-table-column prop="_categoryName" label="故障大类" width="140" sortable>
            </el-table-column>
            
            <el-table-column label="操作" width="300">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="handleComment(scope.$index,scope.row)">查看故障信息</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="型号ID" prop="modelID">
                    <el-input v-model="editForm.modelID" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="故障大类ID" prop="categoryID">
                    <el-input v-model="editForm.categoryID" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="故障名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="editForm.price" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="修理方法" prop="repairMethod">
                    <el-input v-model="editForm.repairMethod" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="修理时长" prop="repairDuration">
                    <el-input v-model="editForm.repairDuration" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="修理说明" prop="repairInstructions">
                    <el-input v-model="editForm.repairInstructions" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="热门维修" prop="repairInstructions">
                    <el-switch v-model="editForm.isPopular" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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

    </section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getAllMalfunctionCategory, getAllMalfunctionDetail } from '../../api/api';
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
            total: 6,
            page: 1,
            listLoading: false,
            sels: [],//列表选中列
            brandID: 0,
            brandName: "",
            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ]
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
            this.listLoading = true;
            let para = { detailID: this.objects[index].detailID };
            this.$http.post(host + "deleteMalfunctionDetailByID/", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
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
            this.editForm = Object.assign({}, row);
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

        handleCurrentChange: function(val) {
            console.log(val)
            this.page = val
            this.getMalfunctionDetail()
        },
        //编辑
        editSubmit: function() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.editForm);
                        if (para.isPopular == true) {
                            para.isPopular = 1
                        } else {
                            para.isPopular = 0
                        }
                        var params = JSON.stringify(para)
                        console.log(params)
                        this.$http.post(host + "setMalfunctionDetail/", params, { headers: "Content-Type:application/json" }).then(function(response) {
                            this.editLoading = false;
                            this.editFormVisible = false;
                            this.getMalfunctionDetail()
                        }).catch(function(error) {
                            console.log(error)
                        })

                    });
                }
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
            getAllMalfunctionDetail().then((res) => {
                console.log(res.data)
                for (var i in res.data) {
                    var temp = res.data[i]
                    var tempcata = {}
                    tempcata.detailID = temp.pk
                    tempcata.categoryID = temp.fields._category
                    tempcata.modelID = temp.fields._electronicsModel
                    tempcata.name = temp.fields._name
                    tempcata.price = temp.fields._price.toString()
                    tempcata.repairDuration = temp.fields._repairDuration
                    tempcata.repairInstructions = temp.fields._repairInstructions
                    tempcata.repairMethod = temp.fields._repairMethod
                    tempcata.isPopular = temp.fields._isPopular
                    tempcata.modelName = temp.fields._modelName
                    tempcata.brandName = temp.fields._brandName
                    tempcata._categoryName = temp.fields._categoryName
                    this.objects.push(tempcata)
                }
                this.total = 120
                this.getMalfunctionDetailByBrand(this.page)
            })
        },
        getMalfunctionDetailByBrand: function(page) {
            var _objects = []
            console.log(page)
            console.log(this.objects)
            if (page === 1) {
                this.objects.forEach(function(element) {
                    if (element.brandName === " 苹果") {
                        console.log(element)
                        _objects.push(element)
                    }
                }, this);
            } else if (page === 2) {
                this.objects.forEach(function(element) {
                    if (element.brandName === " 华为") {
                        _objects.push(element)
                    }
                }, this);
            }
            else if (page == 3) {
                this.objects.forEach(function(element) {
                    if (element.brandName === " 小米") {
                        _objects.push(element)
                    }
                }, this);
            }
            else if (page == 4) {
                this.objects.forEach(function(element) {
                    if (element.brandName === " vivo") {
                        _objects.push(element)
                    }
                }, this);
            }
            else if (page == 5) {
                this.objects.forEach(function(element) {
                    if (element.brandName === " 三星") {
                        _objects.push(element)
                    }
                }, this);
            }
            else if (page == 6) {
                this.objects.forEach(function(element) {
                    if (element.brandName === "oppo ") {
                        _objects.push(element)
                    }
                }, this);
            }
            console.log(_objects)
            this.objects = _objects
        },
    },

    mounted() {
        this.getMalfunctionDetail()

    },

}

</script>

<style scoped>

</style>