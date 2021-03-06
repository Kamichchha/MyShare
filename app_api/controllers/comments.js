var mongoose=require('mongoose');
var StockModel=mongoose.model('Stock');


module.exports.addStockComment=function(req,res,next){
    if(req.params && req.params.stockId){
        StockModel.findById(req.params.stockId).select("reviews").exec(function(err,stock){
            if (!(stock)){
                sendResponse(res,404,{"message":"Stock not found"});
                return;
            }
            if(err){
                sendResponse(res,400,err);
                return;
            }
            
            stock.reviews.push({
                author:req.body.author,
                comment:req.body.comment
            });

            stock.save(function(err,stock){
                if(err){
                    sendResponse(res,400,err);
                    return;
                }
                var thisReview;
                thisReview=stock.reviews[stock.reviews.length-1];
                sendResponse(res,200,thisReview);
            });
        });
    }
    else{
        sendResponse(res,404,"Stock Id is required");
    }
};

module.exports.readStockCommentOne=function(req,res,next){
    if(req.params && req.params.stockId && req.params.commentId){
        StockModel.findById(req.params.stockId).select("stockName reviews").exec(function(err,stock){
            if (!(stock)){
                sendResponse(res,404,{"message":"Stock not found"});
                return;
            }
            if(err){
                sendResponse(res,404,err);
                return;
            }
            if(stock.reviews && stock.reviews.length>0){
                review=stock.reviews.id(req.params.commentId);
                if(!(review)){
                    sendResponse(res,404,"No matching review found");
                    return;
                }
                else{
                    sendResponse(res,200,{"stock":
                            {"name":stock.stockName,"stockId":stock.stockId
                         },
                         "review":review
                    });
                }
            }
            else{
                sendResponse(res,404,"No reviews found for this stock");
            }
        });
    }
    else{
        sendResponse(res,404,"Both Stock Id and Comment Id is required");
    }
};

module.exports.updateStockCommentOne=function(req,res,next){
    if(req.params && req.params.stockId && req.params.commentId){
        StockModel.findById(req.params.stockId).select("stockName reviews").exec(function(err,stock){
            if (!(stock)){
                sendResponse(res,404,{"message":"Stock not found"});
                return;
            }
            if(err){
                sendResponse(res,404,err);
                return;
            }
            if(stock.reviews && stock.reviews.length>0){
                var review=stock.reviews.id(req.params.commentId);
                if(!(review)){
                    sendResponse(res,404,"No matching review found");
                    return;
                }
                else{
                    review.author=req.body.author;
                    review.comment=req.body.comment;
                    stock.save(function(err,stock){
                        if(err){
                            sendResponse(res,404,err);
                            return;
                        }
                        sendResponse(200,stock.reviews.id(req.params.commentId));
                    });                    
                }
            }
            else{
                sendResponse(res,404,"No reviews found for this stock");
            }
        });
    }
    else{
        sendResponse(res,404,"Both Stock Id and Comment Id is required");
    }
};

module.exports.deleteStockCommentOne=function(req,res,next){
    if(req.params && req.params.stockId && req.params.commentId){
        StockModel.findById(req.params.stockId).select("stockName reviews").exec(function(err,stock){
            if (!(stock)){
                sendResponse(res,404,{"message":"Stock not found"});
                return;
            }
            if(err){
                sendResponse(res,404,err);
                return;
            }
            if(stock.reviews && stock.reviews.length>0){
                if(!(stock.reviews.id(req.params.commentId))){
                    sendResponse(res,404,"No matching review found");
                    return;
                }
                else{
                    stock.reviews.id(req.params.commentId).remove();
                    stock.save(function(err,stock){
                        if(err){
                            sendResponse(res,404,err);
                            return;
                        }
                        sendResponse(res,204,stock);
                    });
                }
            }
            else{
                sendResponse(res,404,"No reviews found for this stock");
            }
        });
    }
    else{
        sendResponse(res,404,"Both Stock Id and Comment Id is required");
    }
};


var sendResponse=function(res,statusCode,data){
    res.status(statusCode);
    res.json(data);
}
