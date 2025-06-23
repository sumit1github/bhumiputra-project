import uuid
from django.core.cache import cache

from users_module.constants import roles


def generate_unique_id(digit):
    return str(int(str(uuid.uuid4().int)[:digit]))


def serilalizer_error_list(serilaizer_error):
    error_list = []
    for field, errors in serilaizer_error.items():
        for error in errors:
            error_list.append(f'{field}: {error}')
    
    return error_list

def get_all_roles():
    return cache.get_or_set('roles', roles, timeout=2592000)