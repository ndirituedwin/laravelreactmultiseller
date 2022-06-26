import Dashboard from '../../../Components/Admin/Partials/Admindshboard.js';
import Profile from '../../../Components/Admin/Profile';
import ViewSections from '../../../Components/Admin/Modules/Sections/ViewSections.js'
import AddSection from '../../../Components/Admin/Modules/Sections/AddSection.js';
import EditSection from '../../../Components/Admin/Modules/Sections/EditSection.js';
import TrashedSections from '../../../Components/Admin/Modules/Sections/TrashedSections.js';
import ViewBrands from '../../../Components/Admin/Modules/Brands/ViewBrands.js'
import AddBrand from '../../../Components/Admin/Modules/Brands/AddBrand.js';
import EditBrand from '../../../Components/Admin/Modules/Brands/EditBrand.js';
import TrashedBrands from '../../../Components/Admin/Modules/Brands/TrashedBrands.js';
import AddCategory from '../../../Components/Admin/Modules/Categories/AddCategory.js';
import ViewCategories from '../../../Components/Admin/Modules/Categories/ViewCategories.js';
import EditCategory from '../../../Components/Admin/Modules/Categories/EditCategory.js';
import TrashedCategories from '../../../Components/Admin/Modules/Categories/TrashedCategories.js';
import ViewProducts from '../../../Components/Admin/Modules/Products/ViewProducts.js';
import AddProduct from '../../../Components/Admin/Modules/Products/AddProduct.js';
import EditProduct from '../../../Components/Admin/Modules/Products/EditProduct.js';
import TrashedProducts from '../../../Components/Admin/Modules/Products/TrashedProducts.js';
import ProductAttributes from '../../../Components/Admin/Modules/Products/ProductAttributes.js';
import Productimages from '../../../Components/Admin/Modules/Products/Productimages.js';
const routes=[
    
    {path:'/admin',exact:true,name:'Admin'},
    {path:'/admin/dashboard',exact:true,name:'Dashboard',component:Dashboard},
    {path:'/admin/profile',exact:true,name:'Profile',component:Profile},
    /**sections */
    {path:'/admin/view/sections',exact:true,name:'Section',component:ViewSections}, 
    {path:'/admin/add/section',exact:true,name:'Section',component:AddSection},  
    {path:'/admin/edit/edit-section/:slug',exact:true,name:'EditSection',component:EditSection},
    {path:'/admin/view/trashed-sections',exact:true,name:'TrashedSections',component:TrashedSections},  
    /**end of sections */  
    /**brands */
    {path:'/admin/view/brands',exact:true,name:'Brand',component:ViewBrands}, 
    {path:'/admin/add/brand',exact:true,name:'Brand',component:AddBrand},  
    {path:'/admin/edit/edit-brand/:slug',exact:true,name:'EditBrand',component:EditBrand},
    {path:'/admin/view/trashed-brands',exact:true,name:'TrashedBrands',component:TrashedBrands}, 
    /**end of brands */  
     /**categories */
     {path:'/admin/view/categories',exact:true,name:'Category',component:ViewCategories}, 
     {path:'/admin/add/category',exact:true,name:'Category',component:AddCategory},  
     {path:'/admin/edit/edit-category/:slug',exact:true,name:'EditCategory',component:EditCategory},
     {path:'/admin/view/trashed-categories',exact:true,name:'TrashedCategories',component:TrashedCategories},  
     /**end of categories */  
    
     
     /**products */
     {path:'/admin/view/products',exact:true,name:'Product',component:ViewProducts}, 
     {path:'/admin/add/product',exact:true,name:'Product',component:AddProduct},  
     {path:'/admin/edit/edit-product/:slug',exact:true,name:'EditProduct',component:EditProduct},
     {path:'/admin/view/trashed-products',exact:true,name:'TrashedProducts',component:TrashedProducts}, 
     {path:'/admin/edit/add-product-attribute/:slug',exact:true,name:'ProductAttributes',component:ProductAttributes},
     {path:'/admin/edit/add-multiple-product-images/:slug',exact:true,name:'Productimages',component:Productimages}  
     /**end of products */  
    
];

export default routes;