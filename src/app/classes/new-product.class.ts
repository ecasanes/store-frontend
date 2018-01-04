
import {ProductVariation} from "./product-variation.class";
export class NewProduct {

    constructor(){
        this.name = "";
        this.code = "";
        this.description = "";
        this.image_url = "";
        this.product_category_id = null;
        this.variations.push(new ProductVariation());
    }

    id?: number;
    name: string;
    code: string;
    description: string;
    image_url: string;
    status: string;
    product_category_id: number;
    variations: Array<ProductVariation> = [];

    addNewVariation(){

        const variations = this.variations;
        const length = variations.length;
        const lastVariation = variations[length-1];

        if(lastVariation.isValid()){
            this.variations.push(new ProductVariation());
        }

    }

    removeVariation(variation: ProductVariation){

        const position = this.variations.findIndex(function(prodVariation){

            return variation.product_variation_id == prodVariation.product_variation_id

        });

        this.variations.splice(position,1);

    }

    removeVariationByIndex(index: number){

        if(this.variations.length<=1){
            return false;
        }

        this.variations.splice(index, 1);
    }
}