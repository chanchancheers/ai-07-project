from flask import Blueprint

bp = Blueprint('model', __name__, url_prefix='/model')

@bp.route('/')
def model_intro():
    return "모델소개, 모델에 넣을 입력값을 요구하는 공간"