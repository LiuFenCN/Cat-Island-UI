<?php

namespace Cathi\FlarumLinkage\Api\Controller;

use Tobscure\JsonApi\Serializer\AbstractSerializer;

/**
 * 最小序列化器 — 用于联动系统 API 返回值。
 * Flarum API 控制器要求 $serializer 属性指向一个 Serializer 类。
 */
class QuestProgressSerializer extends AbstractSerializer
{
    protected $type = 'linkage-quest-progress';
}
