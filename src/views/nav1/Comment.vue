<template>
    <section>

        <!--工具条-->
        <!--<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUser">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>-->

        <!--列表-->
        <template>
            <el-table :data="comments" highlight-current-row v-loading="loading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="user_name" label="姓名" width="120" sortable>
                </el-table-column>
                <el-table-column prop="stars" label="满意度" width="100" sortable>
                </el-table-column>
                <el-table-column prop="content" label="评价" width="200" sortable>
                </el-table-column>
                <el-table-column prop="imgs" label="配图" min-width="180" sortable>
                    <template scope="scope">
                        <img v-for="item in scope.row.img_arr" :src="item" alt="" width="60px">
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template scope="scope">
                        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>

    </section>
</template>

<script>
import { getUserList } from '../../api/api';
export default {
    data() {
        return {
            filters: {
                name: ''
            },
            loading: false,
            users: [
            ],
            comments: [
                {
                    id: "",
                    name: "adfadf",
                    star: "4",
                    content: "fgsgfsfhshrgsergs",
                    img_arr: ["http://p2ebmjpqm.bkt.clouddn.com/17.jpg"]
                }

            ],
            id: ''
        }
    },
    methods: {
        //性别显示转换
        formatSex: function(row, column) {
            return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
        },
        getCommentByID: function() {
            var _id = this.id
            this.$http.get("https://ferrariwang.cn/homeparty/mini-program/getVillaCommentByID?id=" + _id, { headers: "Content-Type:application/json" }).then(function(response) {
				this.comments = response.body.data.comments
                console.log(response)
			}).catch(function(error) {
				console.log(error)
			})
        },
        handleDelete(index,row){
            console.log(this.comments[index])
            var _id = this.comments[index].comment_id
            this.$http.get("https://ferrariwang.cn/homeparty/manage/deleteByCommentId?id=" + _id, { headers: "Content-Type:application/json" }).then(function(response) {
				
                console.log(response)
			}).catch(function(error) {
				console.log(error)
			})
        }
    },
    mounted() {
        console.log(this.$route.params.id)
		var _id = this.$route.params.id
		this.id = _id
        this.getCommentByID()
    }
};

</script>

