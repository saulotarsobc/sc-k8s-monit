# Kubernetes Metrics

## DigitalOcean Metrics Server (kubectl get top ...)

O erro `Metrics API not available` indica que o **Metrics Server não está instalado** ou não está acessível no cluster Kubernetes da DigitalOcean.

---

### 🚨 Por que isso acontece?

A DigitalOcean, por padrão, **não habilita o Metrics Server** nos clusters gerenciados. Isso é comum por razões de desempenho e escolha de ferramentas (alguns usam Prometheus/Grafana em vez do Metrics Server).

---

### ✅ Soluções possíveis

#### 🔧 **Opção 1: Instalar o Metrics Server**

Você pode instalar o Metrics Server com este comando (recomendado):

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Depois disso, você pode precisar editar o deployment para evitar erros de verificação de certificados (comum em ambientes como DigitalOcean).

##### ➕ Passo adicional (caso precise):

Edite o deployment:

```bash
kubectl edit deployment metrics-server -n kube-system
```

E adicione este argumento no `containers.args`:

```yaml
- --kubelet-insecure-tls
```

Depois de uns minutos, teste com:

```bash
kubectl top pods
kubectl top nodes
```

Se funcionar, o seu script PowerShell funcionará normalmente com métricas de CPU e memória.

---

#### 🔒 **Opção 2: Usar Prometheus (alternativa mais robusta)**

Se seu cluster já possui **Prometheus**, você pode:

- Expor as métricas via `kubectl port-forward` ou ingress
- Fazer requisições HTTP a `/api/v1/query` do Prometheus para extrair métricas

Isso exigiria um script mais avançado com chamadas HTTP e autenticação, mas posso gerar esse também se você estiver usando Prometheus.

---

### ✅ Resumo do que você deve fazer agora

1. **Rode o comando abaixo para instalar o Metrics Server**:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

2. **Adicione o parâmetro `--kubelet-insecure-tls`** se necessário.

3. Aguarde 1-2 minutos e tente novamente:

```bash
kubectl top pods
```

---
