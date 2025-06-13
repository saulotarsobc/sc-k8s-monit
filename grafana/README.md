# **Prometheus** e **Grafana**

Monitorar um cluster Kubernetes na DigitalOcean com **Prometheus** e **Grafana** é uma prática comum e muito recomendada. A seguir, descrevo um passo a passo para configurar esse monitoramento.

---

## 🔧 Etapas para configurar Prometheus e Grafana no Kubernetes (DigitalOcean)

### 1. **Pré-requisitos**

- Cluster Kubernetes já criado na DigitalOcean (via `doctl` ou painel web)
- `kubectl` configurado e funcionando
- `Helm` instalado (gerenciador de pacotes do Kubernetes)

---

### 2. **Adicionar o repositório Helm da kube-prometheus-stack**

Esse Helm chart fornece Prometheus, Grafana, Alertmanager e exporters.

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

---

### 3. **Instalar o kube-prometheus-stack**

Crie um namespace dedicado:

```bash
kubectl create namespace monitoring
```

Instale o chart:

```bash
helm install kube-prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring
```

Esse comando instalará:

- Prometheus Server
- Grafana
- Node Exporter
- Kube State Metrics
- Alertmanager
- Dashboards e alertas pré-configurados

---

### 4. **Acessar o Grafana**

#### 🔍 Opção 1: Redirecionamento de porta local

```bash
kubectl port-forward svc/kube-prometheus-grafana 3000:80 -n monitoring
```

Acesse via: [http://localhost:3000](http://localhost:3000)
Usuário padrão: `admin`
Senha: obtida com:

```bash
kubectl get secret --namespace monitoring kube-prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 --decode
```

#### 🔍 Opção 2: Expor via LoadBalancer ou Ingress

Você pode editar o `values.yaml` ou usar Helm para ativar o LoadBalancer:

```bash
helm upgrade kube-prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.service.type=LoadBalancer
```

Depois de alguns minutos:

```bash
kubectl get svc -n monitoring
```

Procure o `EXTERNAL-IP` do serviço `kube-prometheus-grafana`.

---

### 5. **Dashboards no Grafana**

O Helm chart já vem com dashboards do Kubernetes, nodes, pods, etc. pré-configurados.

Você pode verificar esses dashboards em:
→ _Grafana UI > Dashboards > Manage_

---

### 6. **Persistência e Customizações (Opcional)**

- Use `values.yaml` para definir PVCs para Prometheus/Grafana.
- Crie alertas customizados.
- Configure regras de retenção de métricas.

---

### 7. **Monitoramento de custos (opcional)**

Para clusters na DigitalOcean, você pode adicionar a integração com o DigitalOcean Metrics Agent, ou importar métricas via API e exibir no Grafana com datasources externos.

---

## ✅ Resultado Final

Você terá um painel Grafana acessível com métricas completas do seu cluster: CPU, memória, uso de disco, estado de pods, deployments, nodes, etc.

---
