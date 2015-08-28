/**
 * Created by Tom on 17/08/2015.
 */



//FIELD
/**
 *A Field is only composed by its width and its height.
 */
function Field(params){
    if (!params) params={};
    this.width = params.width || 500;
    this.height = params.height || 500;

}

Field.prototype.canContain = function(obj){
    if(obj.radius){
        // Obj is a ball
        return obj.position.x>obj.radius && obj.position.x<this.width-obj.radius && obj.position.y>obj.radius && obj.position.y<this.height-obj.radius;
    }
}

module.exports = Field;