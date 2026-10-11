import * as React from 'react';
import {
  Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Textarea, Select, Field, Checkbox, Radio, Switch, Slider, Separator,
  Badge, BadgeAnchor, Tag, Kbd, Spinner, Skeleton, Alert, Progress, Avatar, AvatarGroup,
  Empty, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSep,
  Tooltip, Table, THead, TBody, Tr, Th, Td, Toggle, ToggleGroup,
  Dropdown, DropdownItem, DropdownLabel, DropdownSeparator,
  Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose,
  Sheet, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Tabs,
  RadioGroup, RadioItem, RadioPills, RadioPillItem,
  List, ListRow, SettingsPanel, SettingRow, TaskItem,
  SearchBar, Sidebar, SidebarItem, TabBar, TabBarItem,
  ToastProvider, useToast,
} from './components';

const THEMES = ['cozy', 'endfield', 'liquidglass'] as const;
type Theme = (typeof THEMES)[number];
const THEME_LABEL: Record<Theme, string> = {
  cozy: '🏝️ 动森', endfield: '🛰️ 终末地', liquidglass: '🫧 液态玻璃',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cathi-card" style={{ marginBottom: 28 }}>
      <div className="cathi-card__header">
        <h2 className="cathi-card__title">{title}</h2>
      </div>
      <div className="cathi-card__body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </section>
  );
}

function Row({ children, wrap = true }: { children: React.ReactNode; wrap?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: wrap ? 'wrap' : 'nowrap' }}>
      {children}
    </div>
  );
}

function AppInner() {
  const [theme, setTheme] = React.useState<Theme>('cozy');
  const [dark, setDark] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(62);

  // 新组件演示用的受控状态
  const [plan, setPlan] = React.useState('month');
  const [size, setSize] = React.useState('m');
  const [taskDone, setTaskDone] = React.useState(false);
  const [nav, setNav] = React.useState('home');
  const [tab, setTab] = React.useState('home');
  const { toast } = useToast();

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    if (dark) document.body.setAttribute('data-dark', '');
    else document.body.removeAttribute('data-dark');
  }, [theme, dark]);

  return (
    <div className="wrap" style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 20px 100px' }}>
      <header className="cathi-card" style={{ marginBottom: 28, textAlign: 'center', background: 'linear-gradient(160deg, hsl(var(--cathi-primary) / .12), hsl(var(--cathi-amber) / .12))' }}>
        <div className="cathi-card__body">
          <h1 style={{ fontSize: 38, margin: 0 }}>🐱 cathi-ui React</h1>
          <p className="cathi-muted" style={{ fontWeight: 700 }}>shadcn 风格组件 · 三套主题一键切换</p>
          <Row wrap>
            <span className="cathi-muted" style={{ fontWeight: 800 }}>主题</span>
            <div className="cathi-theme-switch" role="group" aria-label="主题切换">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={theme === t ? 'is-active' : ''}
                  onClick={() => setTheme(t)}
                >
                  {THEME_LABEL[t]}
                </button>
              ))}
              <button type="button" className={dark ? 'is-active' : ''} onClick={() => setDark((d) => !d)}>
                🌙 暗色
              </button>
            </div>
          </Row>
        </div>
      </header>

      <Section title="按钮 Buttons">
        <Row>
          <Button>主按钮</Button>
          <Button variant="secondary">次要</Button>
          <Button variant="outline">描边</Button>
          <Button variant="ghost">幽灵</Button>
          <Button variant="destructive">危险</Button>
          <Button variant="link">链接</Button>
        </Row>
        <Row>
          <Button variant="amber">琥珀</Button>
          <Button variant="pink">樱粉</Button>
          <Button variant="sky">天蓝</Button>
          <Button variant="grape">葡萄</Button>
        </Row>
        <Row>
          <Button size="sm">小</Button>
          <Button>默认</Button>
          <Button size="lg">大</Button>
          <Button size="icon">★</Button>
          <Button disabled>禁用</Button>
        </Row>
      </Section>

      <Section title="表单 Forms">
        <Field label="昵称" htmlFor="r-name" help="这是帮助文字">
          <Input id="r-name" placeholder="请输入昵称" />
        </Field>
        <Field label="邮箱" htmlFor="r-mail" error="邮箱格式不正确">
          <Input id="r-mail" placeholder="you@cathi.cn" invalid defaultValue="not-an-email" />
        </Field>
        <Field label="简介">
          <Textarea placeholder="写点什么…" />
        </Field>
        <Field label="城市">
          <Select defaultValue="">
            <option value="">请选择</option>
            <option value="sh">上海</option>
            <option value="bj">北京</option>
          </Select>
        </Field>
        <Row>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <Checkbox defaultChecked /> 记住我
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <Radio name="plan" defaultChecked /> 月付
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <Radio name="plan" /> 年付
          </label>
          <Switch defaultChecked />
          <span className="cathi-muted">启用通知</span>
        </Row>
        <Row>
          <span className="cathi-muted" style={{ fontWeight: 800, minWidth: 90 }}>音量 {progress}%</span>
          <Slider min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} style={{ flex: 1 }} />
        </Row>
      </Section>

      <Section title="反馈 Feedback">
        <Alert icon="💡" title="提示" variant="default">这是一条默认提示信息。</Alert>
        <Alert icon="✅" title="成功" variant="success">操作已完成。</Alert>
        <Alert icon="⚠️" title="警告" variant="warning">磁盘空间不足。</Alert>
        <Alert icon="⛔" title="错误" variant="destructive">提交失败，请重试。</Alert>
        <Row>
          <Tag>默认</Tag>
          <Tag variant="secondary">次要</Tag>
          <Tag variant="outline">描边</Tag>
          <Tag variant="success">成功</Tag>
          <Tag variant="info">信息</Tag>
          <Tag variant="amber">琥珀</Tag>
          <Tag variant="pink">樱粉</Tag>
          <Tag variant="sky">天蓝</Tag>
          <Tag variant="grape">葡萄</Tag>
        </Row>
        <Row>
          <BadgeAnchor>
            <Button variant="ghost" size="icon">🔔</Button>
            <Badge>3</Badge>
          </BadgeAnchor>
          <BadgeAnchor>
            <Avatar size="sm" style={{ background: 'hsl(var(--cathi-primary) / .2)' }} />
            <Badge variant="dot" />
          </BadgeAnchor>
          <Kbd>⌘</Kbd><Kbd>K</Kbd>
          <Spinner />
          <Spinner size="lg" />
        </Row>
        <Row>
          <Skeleton style={{ width: 120, height: 16 }} />
          <Skeleton shape="circle" style={{ width: 48, height: 48 }} />
          <Skeleton shape="text" style={{ width: 200 }} />
        </Row>
        <Row>
          <Tooltip content="这是气泡提示">悬停我</Tooltip>
          <Tooltip content="在右侧" side="right"><Button variant="outline">右侧提示</Button></Tooltip>
        </Row>
      </Section>

      <Section title="浮层 Overlays">
        <Row>
          <Dropdown trigger="菜单 ▾">
            <DropdownLabel>操作</DropdownLabel>
            <DropdownItem onClick={() => alert('编辑')}>编辑</DropdownItem>
            <DropdownItem shortcut="⌘D">复制</DropdownItem>
            <DropdownSeparator />
            <DropdownItem variant="destructive">删除</DropdownItem>
          </Dropdown>

          <Button onClick={() => setDialogOpen(true)}>打开对话框</Button>
          <Button variant="outline" onClick={() => setSheetOpen(true)}>打开抽屉</Button>
        </Row>
        <Accordion>
          <AccordionItem open>
            <AccordionTrigger>什么是 cathi-ui？</AccordionTrigger>
            <AccordionContent>一套自研治愈系 UI 设计系统，参考 shadcn 的 Token 架构，零依赖、可换肤。</AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>支持哪些主题？</AccordionTrigger>
            <AccordionContent>动森（默认）、终末地、液态玻璃，均通过语义 Token 切换。</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="数据展示 Data">
        <Breadcrumb>
          <BreadcrumbItem><BreadcrumbLink href="#">首页</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSep />
          <BreadcrumbItem><BreadcrumbLink href="#">组件</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSep />
          <BreadcrumbItem><BreadcrumbPage>按钮</BreadcrumbPage></BreadcrumbItem>
        </Breadcrumb>
        <Progress value={progress} label="下载进度" />
        <Row>
          <Avatar style={{ background: 'hsl(var(--cathi-primary) / .2)' }} />
          <Avatar size="lg" shape="round" style={{ background: 'hsl(var(--cathi-amber) / .25)' }} />
          <AvatarGroup>
            <Avatar size="sm" style={{ background: 'hsl(var(--cathi-sky) / .25)' }} />
            <Avatar size="sm" style={{ background: 'hsl(var(--cathi-pink) / .25)' }} />
            <Avatar size="sm" style={{ background: 'hsl(var(--cathi-grape) / .25)' }} />
          </AvatarGroup>
        </Row>
        <ToggleGroup>
          <Toggle defaultPressed>日</Toggle>
          <Toggle>周</Toggle>
          <Toggle>月</Toggle>
        </ToggleGroup>
        <Table>
          <THead>
            <Tr><Th>名称</Th><Th>状态</Th><Th>操作</Th></Tr>
          </THead>
          <TBody>
            <Tr><Td>项目 A</Td><Td><Tag variant="success">已上线</Tag></Td><Td><Button size="sm">查看</Button></Td></Tr>
            <Tr><Td>项目 B</Td><Td><Tag variant="warning">进行中</Tag></Td><Td><Button size="sm">查看</Button></Td></Tr>
            <Tr><Td>项目 C</Td><Td><Tag variant="destructive">已暂停</Tag></Td><Td><Button size="sm">查看</Button></Td></Tr>
          </TBody>
        </Table>
        <Empty icon="📭" title="暂无数据" description="当前分类下没有任何内容。" />
      </Section>

      <Section title="标签页 Tabs">
        <Tabs items={[
          { value: 'a', label: '概览', content: <p className="cathi-muted">这里是概览内容。</p> },
          { value: 'b', label: '设置', content: <p className="cathi-muted">这里是设置内容。</p> },
          { value: 'c', label: '关于', content: <p className="cathi-muted">这里是关于内容。</p> },
        ]} />
      </Section>

      {/* ───────────── 新增组件演示 ───────────── */}

      <Section title="选择控件 Selection">
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <RadioGroup value={plan} onValueChange={setPlan} name="demo-plan">
            <RadioItem value="month" label="月付" hint="¥12 / 月" />
            <RadioItem value="year" label="年付" hint="¥99 / 年" />
            <RadioItem value="off" label="暂不订阅" disabled />
          </RadioGroup>
          <div>
            <div className="cathi-muted" style={{ fontWeight: 800, marginBottom: 8 }}>尺码（药丸组）</div>
            <RadioPills value={size} onValueChange={setSize} name="demo-size">
              <RadioPillItem value="s">S</RadioPillItem>
              <RadioPillItem value="m">M</RadioPillItem>
              <RadioPillItem value="l">L</RadioPillItem>
              <RadioPillItem value="xl">XL</RadioPillItem>
            </RadioPills>
          </div>
        </div>
      </Section>

      <Section title="列表与面板 Lists & Panels">
        <List>
          <ListRow icon="🔔" iconColor="amber" title="通知" sub="你有 3 条新消息" chevron link onClick={() => toast('打开通知', { variant: 'default' })} />
          <ListRow icon="💾" iconColor="sky" title="存储空间" sub="已用 64%" chevron link onClick={() => toast('打开存储', { variant: 'default' })} />
          <ListRow icon="⚙️" iconColor="grape" title="设置" sub="系统偏好" chevron link onClick={() => toast('打开设置', { variant: 'default' })} />
        </List>
        <SettingsPanel title="隐私设置">
          <SettingRow label="公开个人资料"><Switch defaultChecked /></SettingRow>
          <SettingRow label="定位服务"><Switch /></SettingRow>
          <SettingRow label="个性化推荐"><Switch defaultChecked /></SettingRow>
        </SettingsPanel>
        <div>
          <div className="cathi-muted" style={{ fontWeight: 800, marginBottom: 8 }}>任务清单（点击圆圈切换完成态）</div>
          <TaskItem done={taskDone} text="完成组件库 v2 演示" onToggle={setTaskDone} />
          <TaskItem done text="修复 Dropdown 点击外部关闭" />
          <TaskItem text="补充 Toast 组件" />
        </div>
      </Section>

      <Section title="导航 Navigation">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div className="cathi-muted" style={{ fontWeight: 800, marginBottom: 8 }}>侧边导航</div>
            <Sidebar>
              <SidebarItem icon="🏠" active={nav === 'home'} onClick={() => setNav('home')}>首页</SidebarItem>
              <SidebarItem icon="📊" active={nav === 'stats'} onClick={() => setNav('stats')}>统计</SidebarItem>
              <SidebarItem icon="💬" active={nav === 'chat'} onClick={() => setNav('chat')}>消息</SidebarItem>
              <SidebarItem icon="⚙️" active={nav === 'settings'} onClick={() => setNav('settings')}>设置</SidebarItem>
            </Sidebar>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="cathi-muted" style={{ fontWeight: 800, marginBottom: 8 }}>底部 Tab Bar</div>
            <TabBar>
              <TabBarItem icon="🏠" label="首页" active={tab === 'home'} onClick={() => setTab('home')} />
              <TabBarItem icon="🔍" label="发现" active={tab === 'discover'} onClick={() => setTab('discover')} />
              <TabBarItem icon="➕" label="发布" active={tab === 'post'} onClick={() => setTab('post')} />
              <TabBarItem icon="👤" label="我的" active={tab === 'me'} onClick={() => setTab('me')} />
            </TabBar>
          </div>
        </div>
      </Section>

      <Section title="搜索与提示 Search & Toast">
        <SearchBar placeholder="搜索组件…" onSubmit={(v) => toast(`搜索：${v || '（空）'}`, { variant: 'success' })} />
        <Row>
          <Button variant="outline" onClick={() => toast('这是一条普通提示')}>默认 Toast</Button>
          <Button variant="outline" onClick={() => toast('保存成功', { variant: 'success' })}>成功 Toast</Button>
          <Button variant="outline" onClick={() => toast('注意，磁盘快满了', { variant: 'warn' })}>警告 Toast</Button>
          <Button variant="outline" onClick={() => toast('操作失败，请重试', { variant: 'error' })}>错误 Toast</Button>
        </Row>
      </Section>

      <Card>
        <CardHeader>
          <CardTitle>卡片示例</CardTitle>
          <CardDescription>卡片由语义 Token 驱动，三套主题下自动换肤。</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="cathi-muted">卡片内容区域。可放入任意组件。</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">确定</Button>
          <Button size="sm" variant="ghost">取消</Button>
        </CardFooter>
      </Card>

      <Separator style={{ margin: '28px 0' }} />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>此操作不可撤销，确定要删除吗？</DialogDescription>
          <DialogClose />
        </DialogHeader>
        <DialogBody>
          <p className="cathi-muted">删除后数据将从服务器永久移除。</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>取消</Button>
          <Button variant="destructive" onClick={() => setDialogOpen(false)}>删除</Button>
        </DialogFooter>
      </Dialog>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} side="right">
        <DialogHeader>
          <DialogTitle>设置抽屉</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogBody>
          <Field label="显示名称"><Input defaultValue="cathi" /></Field>
          <Field label="接收通知"><Switch defaultChecked /></Field>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setSheetOpen(false)}>完成</Button>
        </DialogFooter>
      </Sheet>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
